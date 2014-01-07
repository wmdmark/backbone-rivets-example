# Backbone.js + Rivet.js = Crazy Delicious

At Pathwright we use Backbone.js heavily, every day. and while Backbone.js is a great starting point for larger, client-side applications, it's really minimal.

It requires creating your own patterns and architecture. There's no right way to do it.

So when tackling various pain points in web development, you've still got to pick the right tools for the job. 

Rivets.js and Backbone have helped me solve some of those pain points rather elegantly I think. In this tutorial, we'll go over a brief intro to data binding and then dive write into a practical example of data binding in Backbone.js with Rivets.js.

## A brief overview of data binding
Data binding is the process that establishes a connection between the UI and the application's data models and/or business logic. 

One-way data binding has to do with presenting data from the model to the view (model -> view).

Two-way data binding has to do with both presenting and interacting with data. Presenting the model in the view as well as updating the model from interaction with the view (model <-> view).

When is data binding useful? 
* When you want to update a small part of a view without re-rendering the whole thing
* When you need a live preview based on data input
* Updating data from a form and initializing a form with data
* Many more...

Data binding is not a new concept. This is a concept that's been around for over a decade (mostly in the windows development world) but is just now becoming a pattern on the web.

Some of the hottest new web development stacks have variants of data binding built in at their core including Angular.js, Ember.js, React.js (sort of) among others.

While Backbone, being the minimal framework that it is, does not build in data binding, it's implementations of models with change events + a library like Rivets.js makes it trivial to implement when you need it.

## Data binding with Backbone and Rivets.js
Rivets is a lightweight (3.4kb) library for data binding (and a little templating) for modern web applications
It's framework agnostic so can be used practically web stack. Works best for frameworks that have an event driven patterns built in (model change events etc…)

It's highly configurable and can be made to do pretty much any kind of binding you can think of.

### Rivets 101:

Rivets uses DOM based binding and tempting. You tell Rivets what DOM element to bind-to with minimal instructions and Rivets does the rest. 

For example you can bind a DOM element to a JavaScript object with a single line of codE:

_Note that while you could bind a model or object to the entire document, it's best to only bind to the elements that need to be updated by the model.

```coffeescript
rivets.bind(document.getElementById('info'), data)
```

Rivets supports a lot of different types of binding and other useful components. I recommend you take a minute to look over it's excellent documentation: [http://www.rivetsjs.com/](http://www.rivetsjs.com/)

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



