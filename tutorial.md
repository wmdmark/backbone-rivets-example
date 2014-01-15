# Binding with Backbone

Web frameworks built around data binding are getting quite a lot of attention recently. Angular, Ember, Knockout, Meteor, React and more come with data binding baked in, and with good reason -- binding can help you create faster and more responsive interfaces while writing less code.

Data binding is not a new concept. This is a concept that's been around for over a decade but is just now becoming a pattern on the web. Backbone, however, never has and likely never will ship with any sort of data binding built in. Backbone is agnostic about how views are rendered. Personally, I think this is a good thing. Want to use Handlebars to render your views? Fine. Plain old DOM? Also fine. Binding based views? You betcha.

## Getting started

There are many different libraries[*](#otherlibs) for binding views in Backbone. My personal favorite is [Rivets](rivetsjs.com). Rivets + Backbone has helped me solve some of the most common pain points in web development rather elegantly. 

In this tutorial, we will go over a brief intro to data binding and then dive  into a practical example of data binding in Backbone with Rivets. Before we get into the weeds, let's review what data binding is and what it's good for. 

### What is data binding?
* Data binding is the process that establishes a connection between the UI and the application's data models and/or business logic. 
* One-way data binding presents the model to the view (model -> view).
* Two-way data binding both presents the model in the view as well as updates the model from interactions with the view (model <-> view).

### When is data binding useful?
* When you want to update a small part of a view without re-rendering the whole thing.
* When you need show a live preview based on data input.
* When you need to sync user input with your model (e.g. forms).
* Finite-state machine driven UIs and more.

### Data binding with Rivets

* Rivets is a lightweight (3.4kb) library for data binding for modern web applications.
* It's framework agnostic so it can be used in practically any web stack but it pairs particularly well with Backbone.
* Rivets is highly configurable and can be made to support practically any kind of binding  pattern you can think up.
* Rivets uses DOM-based binding. You tell Rivets what the DOM elements should bind to and Rivets does the rest.


## Backbone.js + Rivet.js = Crazy Delicious

One of the biggest pain points in modern web development is working with forms. There are a plenty of libraries for working with validation and rendering of forms on both the client and the server but in my experience they are consistently the most time-sucking, soul-crushing part of any project. This is an area where data binding, two-way specifically, can make your life easier.

As an example, let's work with a form that modifies a contact model and also show the same contact model in other views. We'll walk through pieces of this example and discuss how Rivets is being used to accomplish our goals.

Take a minute to look at the demo here: [Backbone Rivets Contact Demo](http://wmdmark.github.io/backbone-rivets-example/)

I won't be covering all of the code in the demo but I will cover all the key points. The source for the demo is commented throughout if you would like to dive deeper after the tutorial.

By the way, all the code examples in this tutorial are written in [CoffeeScript](http://coffeescript.org/) for brevity and readability. The same code patterns can of course also be applied in plain old JavaScript.

#### Step 1: The Adapter

Being framework agnostic, you must tell Rivets how to update and read data from your models as things are changed. This is done through a simple adaptor. Adaptors tell Rivets how to watch for changes and apply updates to your model.

Here's the code for a simple Backbone Rivets adaptor:

```coffeescript
rivets.adapters[':'] =
  subscribe: (obj, keypath, callback) ->
    obj.on "change:" + keypath, callback

  unsubscribe: (obj, keypath, callback) ->
    obj.off "change:" + keypath, callback

  read: (obj, keypath) ->
    obj.get keypath

  publish: (obj, keypath, value) ->
    obj.set keypath, value
```

There are more [powerful adaptors](https://github.com/azproduction/rivets-backbone-adapter) for Backbone but this will do for simple model binding.

#### Step 2: The Model

For this example, I've created a simple Backbone model that represents a contact in our application.

```coffeescript
class ContactModel extends Backbone.Model

  defaults: ->
    first_name: ""
    last_name: ""
    short_bio: ""
    github: ""
    twitter: ""
    website: ""

  getGravatar: ->
      return "" if not @get("email")
      "http://www.gravatar.com/avatar/#{hex_md5(@get('email'))}"

  getFullName: -> 
    "#{@get('first_name')} #{@get('last_name')}"
```

Note the two helper functions `getGravatar` and `getFullName`. Those will come into play later in our view templates.

#### Step 3: The Templates

Now let's start with the contact form view:

![](https://s3.amazonaws.com/wmdmark/contact-form-view.png)

And here's the markup _(some tags and attributes ommited for brevity)_:

```html
<form id="contact-form-view">
  <h3>Contact Form View</h3>
  <input type="text" placeholder="First name" rv-value="model:first_name">
  <input type="text" placeholder="Last name" rv-value="model:last_name">
  <textarea placeholder="Short bio" rv-live-value="model:short_bio"></textarea>
  <input type="email" placeholder="Email address" rv-value="model:email">
  <input type="text" placeholder="Twitter" rv-value="model:twitter">
  <input type="text" placeholder="Github" rv-value="model:github">
  <input type="text" placeholder="Website" rv-value="model:website">
</form>
```

See those `rv-value` attributes on the input tags? This is a special rivets attribute that tells Rivets how it should bind data to that element. Note that in the first_name input the binding attribute is set to `rv-value="model:first_name"`. This tells Rivets that we are binding the value of the input element and that we are binding it to the first name attribute of the model. The `:` in between the model and the attribute tells Rivets to use our Backbone adaptor we defined above.

Here is the contact card view that will be updated by our form via the model:

![](https://s3.amazonaws.com/wmdmark/contact-view.png)

And the markup:

```html
<div id="contact-view">
  <div class="info">
    <img rv-src="model.getGravatar < :email" rv-show="model:email">
    <h1>{ model.getFullName < :first_name :last_name }</h1>
    <p rv-html="model:short_bio | linebreaksbr"></p>
  </div>
  <ul class="links">
    <li rv-show="model:github">
      <a rv-href="model:github">
        <i class="fa fa-github"></i>
      </a>
    </li>
    <li rv-show="model:twitter">
      <a rv-href="model:twitter">
        <i class="fa fa-twitter"></i>
      </a>
    </li>
    <li rv-show="model:website">
      <a rv-href="model:website">
        <i class="fa fa-link"></i>
      </a>
    </li>
  <ul>
</div>
```
This view demonstrates a few interesting features beyond basic binding that we will review a little later.

#### Step 4: The Backbone Views

Next, let's create the Backbone Views to apply the bindings to our templates.

```coffeescript
class ContactFormView extends Backbone.Model
  el: "#contact-form-view"

  render: ->
    @binding = rivets.bind(@el, {model: @model})
    return @

  remove: ->
    @binding.unbind()

class ContactView extends Backbone.Model
  el: "#contact-view"

  render: ->
    @binding = rivets.bind(@el, {model: @model})
    return @

  remove: ->
    @binding.unbind()

$ ->
  model = new Backbone.Model()
  new ContactFormView(model: model).render()
  new ContactView(model: model).render()
```

As you can see, we're creating a `binding` property on both views in the `render` function by telling Rivets to bind the view's DOM node (`@el`) to view's model (`@model`). We're also unbinding the `binding` property when the view is removed so that we can avoid memory leaks.

The cool thing about this, is that with very little code, we have a two-way binding between our form, our model and our contact view. So all we'd have to do to save the model to the server (assuming that the form was valid) is call `model.save()`!

We are repeating ourself in the `ContactFormView` and `ContactView`'s binding code. Before we move on, let's refactor our code to be more [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself) by creating a base class that includes the binding functionality.

```coffeescript
class BoundView extends Backbone.View
  render: ->
    super()
    @bindingView = rivets.bind(@el, model: @model, view: @)
    return @
  
  remove: ->
    @bindingView.unbind()
    super()
    
class ContactFormView extends BoundView
  el: "#contact-form-view"

class ContactView extends BoundView
  el: "#contact-view"
```

That's a lot better. Now we can bind any view we like by extending the `BoundView` class and adding the appropriate binding attributes to our template.

## Getting Fancy

The code examples listed above are using some pretty cool features of Rivets that we haven't gone over yet. I'll step throught those now.

#### Custom Bindings

As I mentioned earlier, Rivets is made to be configured and customized to behave however you like and I'm doing just that in parts of our contact view. 

First, I'm using a custom binder on the `<textarea>` element:
```html
<textarea rv-live-value="model:short_bio"></textarea>
```

The `rv-live-value` attribute makes binding to the model occur `onkeyup` instead of on `change` which is the default behavior of `rv-value`. Here's the code to create the live binding:
```coffeescript
rivets.binders['live-value'] =
  publishes: true
  bind: (el) -> $(el).on 'keyup', @publish
  unbind: (el) -> $(el).off 'keyup', @publish
  routine: (el, value) -> rivets.binders.value.routine(el, value)
```

Note that I'm only changing the behavior of the `bind` and `unbind` options while deferring to the normal `rivets.binders.value` function in the binding `routine` function.

Custom bindings are documented in Rivet's [docs](http://www.rivetsjs.com/docs/#binders). I also found reading through the [built-in bindings code](https://github.com/mikeric/rivets/blob/master/src/binders.coffee) very helpful.

#### Formatters

The part of our contact view that is displaying the value of `mode:short_bio` is using another cool feature of Rivets: formatters. Here's the relevent code:

```html
<p rv-html="model:short_bio | linebreaksbr"></p>
```

See that `| linbreaksbr` instruction in the binding attribute? That's a custom formatter. The `rv-html` binding will [set the innerHTML](https://github.com/mikeric/rivets/blob/master/src/binders.coffee#L12) whenver `short_bio` is changed. However, since I am setting the HTML in plain text, I will lose any linebreaks in the attribute since HTML ignores whitespace. This is where my custom formatter comes into play. Any binding can be piped through a formatter that will adjust how the value is displayed on the DOM.

Here's the code for the `linebreaksbr`  formatter that will convert text line breaks (`\n`) to `<br>` tags:

```coffeescript
rivets.formatters.linebreaksbr = (value)->
  return value.replace(/\n/g, '<br>')
```

Creating custom formatters is simple. You can read more about formatters in the [docs](http://www.rivetsjs.com/docs/#formatters).


#### Computed Properties

Take a look at the binding code for our avatar image:
```html
<img rv-src="model.getGravatar < :email" rv-show="model:email"></img>
```

In the code above, I'm binding the `src` attribute of my `<img>` tag to a function on the contact model called `getGravatar`. Notice how I'm using the `.` syntax between the model and the function name instead of the `:` syntax? That's because `getGravatar` is not a Backbone attribute of my model but a function directly on the view object. The `.` syntax tells Rivets to bind using the built-in object adaptor rather than my Backbone adaptor which is indicated by the `:` character.

The other interesting part of this binding setup is the ` < :email` instruction inside the `rv-src` binding. This is telling Rivets to recompute the value of `getGravatar` whenever the `:email` attribute is changed. Computed properties are helpful in scenarios where data needs to  update on a view but isn't necessarily a part of your model's core properties.

## Where to go from here

I hope you can see from this tutorial how useful Rivets can be when combined with Backbone. 

If you'd like to dive deeper, I'd encourage you to check out the [demo](http://wmdmark.github.io/backbone-rivets-example/) as well as its [source code](https://github.com/wmdmark/backbone-rivets-example/blob/master/app/example.coffee).

I'd love to see anything you make as well as hear your feedback on this tutorial. Feel free to reach out to me here on Github or follow me on Twitter: [@wmdmark](http://twitter.com/wmdmark).

---

**Appendix A: <a name="otherlibs"></a> Other Binding Libaries for Backbone**

- [Backbone.stickit](http://nytimes.github.io/backbone.stickit/)
- [Backbone.ModelBinder](https://github.com/theironcook/Backbone.ModelBinder)
- [Knockback.js](http://kmalakoff.github.io/knockback/) (Depends on Knockout.js)



