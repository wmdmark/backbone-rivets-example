# Backbone.js + Rivet.js = Crazy Delicious

Web frameworks with binding support baked in are becoming increasingly popular. Many of the the newer client side frameworks (such as Angular.js) have data binding on a pedestal as a central part of the framework's philosophy.

Backbone.js never has and likely never will have binding baked in. How you display render or display your views is entirely up to you. Want to use handlebars? Fine. Plain old DOM? Also fine. Binding? You betcha.

There are many different libraries[*](#otherlibs) for binding with Backbone.js, but my personal favorite is [Rivets.js](rivetsjs.com).

Rivets.js + Backbone.js has helped me solve some of the most common pain points in web development (such as forms) rather elegantly. 

In this tutorial, we'll go over a brief intro to data binding and then dive write into a practical example of data binding in Backbone.js with Rivets.js.

# Starting from the top

## What is data binding?
* Data binding is the process that establishes a connection between the UI and the application's data models and/or business logic. 
* One-way data binding has to do with presenting data from the model to the view (model -> view).
* Two-way data binding has to do with both presenting and interacting with data. Presenting the model in the view as well as updating the model from interaction with the view (model <-> view).

## When is data binding useful? 
* When you want to update a small part of a view without re-rendering the whole thing
* When you need a live preview based on data input
* Updating data from a form and initializing a form with data
* Many more...

Data binding is not a new concept. This is a concept that's been around for over a decade (mostly in the windows development world) but is just now becoming a pattern on the web.

## Data binding with Backbone and Rivets.js

Rivets is a lightweight (3.4kb) library for data binding (and basic templates) for modern web applications.

It's framework agnostic so it can be used in practically any web stack but it pairs particularly well with Backbone.

Rivets is highly configurable and can be made to support any kind of binding  pattern you can think up.

### Rivets Basics:

Rivets uses DOM based binding and tempting. You tell Rivets what DOM element to bind-to with minimal instructions and Rivets does the rest. 

#### A simple example:

```html
<div id="greet-view">
  <input rv-value="model:first_name" placholder="What's your name?">
  <h1 rv-show="model:first_name">Hi { model:first_name}!</h1>
</div>
```
```coffeescript
model = new Backbone.Model(first_name:"")
rivets.bind($("#greet-view"), model)
```

Rivets supports a lot of different types of binding and other useful components out of the box. I recommend you take a minute to look over it's excellent documentation: [http://www.rivetsjs.com/](http://www.rivetsjs.com/)

### Rivets & Backbone

If you'd like to use Rivets with you'll need to start by creating a simple Adaptor that tells Rivets how to watch for changes and apply updates to your model.

Here's a simple example of a Backbone.js adaptor:

```coffeescript
rivets.adapters[':'] =
  subscribe: (obj, keypath, callback) ->
    return if not obj?
    obj.on "change:" + keypath, callback

  unsubscribe: (obj, keypath, callback) ->
    return if not obj?
    obj.off "change:" + keypath, callback

  read: (obj, keypath) ->
    return if not obj?
    obj.get keypath

  publish: (obj, keypath, value) ->
    return if not obj?
    obj.set keypath, value
```

There are more [powerful adaptors](https://github.com/azproduction/rivets-backbone-adapter) for Backbone but this will do for simple model binding.


## A practical example

One of the biggest pain points in web development is working with forms. There are a ton of libraries for working with validation and rendering of forms both the client and the server but in my experience they are the most time consuming part of web development. This is an area where binding (two-way specifically) can make your life easier.

As an example, let's work with a form that modifies the contact model and also show the same contact model in other views.

#### Contact Manager Demo

Here's the demo page that we'll be pulling examples from: http://wmdmark.github.io/backbone-rivets-example/

The code for the above demo can be found here: https://github.com/wmdmark/backbone-rivets-example/blob/master/app/example.coffee

I won't be covering all of the code in the example but I will cover all the key points. The source for the example is commented throughout if you'd like to dive deeper after the tutorial.

Let's start with the contact form template buillt in [Bootstrap](http://getbootstrap.com):
```html
<form id="contact-form-view" role="form" class="col-md-6">
  <h3>Contact Form View</h3>
  <div class="row">
    <div class="form-group col-sm-6">
      <input type="text" class="form-control" placeholder="First name" rv-value="model:first_name">
    </div>
    <div class="form-group col-sm-6">
      <input type="text" class="form-control" placeholder="Last name" rv-value="model:last_name">
    </div>
  </div>
  <div class="form-group">
    <textarea class="form-control" rows="3" placeholder="Short bio" rv-live-value="model:short_bio"></textarea>
  </div>
  <div class="form-group">
    <input type="email" class="form-control" placeholder="Email address" rv-value="model:email">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" placeholder="Twitter" rv-value="model:twitter">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" placeholder="Github" rv-value="model:github">
  </div>
  <div class="form-group">
    <input type="text" class="form-control" placeholder="Website" rv-value="model:website">
  </div>
</form>
```

See those `rv-value` attributes on the input tags? This is a special rivets attribute that tells Rivets how it should bind data to that element. Note that in the first_name input the binding attribute is set to `rv-value="model:first_name"`. This tells Rivets that we are binding the value of the input element and that we are binding it to the first_name attribute of the model. That ":" in between the model and the attribute tells rivets to use our Backbone adaptor defined above.

Next let's create the Backbone View to bind actually apply the bindings to the form.

```coffeescript
class ContactFormView extends Backbone.Model
  el: "#contact-form-view"

  render: ->
    @binding = rivets.bind(@el, {model: @model})
    @

  remove: ->
    @binding.unbind()

$ ->
  model = new Backbone.Model()
  new ContactFormView(model: model).render()
```

As you can see we're creating a @binding propery on the view in the render function by telling Rivets to bind the view's DOM node (@el) to view's model (@model).
We're also unbinding the @binding property when the view is removed so that we can avoid memory leaks.

The cool thing about this, is that with very little code, we have a two way binding between our form and our model. So all we'd have to do to save the model to the server (assuming that the form was valid) is call `model.save()`!


###<a name="otherlibs"></a> Other Binding Libaries for Backbone
* [Backbone.stickit](http://nytimes.github.io/backbone.stickit/)
* [Backbone.ModelBinder](https://github.com/theironcook/Backbone.ModelBinder)
* [Knockback.js](http://kmalakoff.github.io/knockback/) (Depends on Knockout.js)



