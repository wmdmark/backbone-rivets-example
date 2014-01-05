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

_Note that while you could bind a model or object to the entire document, it's best to only bind to the elements that need to be updated by the model._

`rivets.bind(document.getElementById('#info'), data);`

Rivets supports a lot of different types of binding and other useful components. I recommend you take a minute to look over it's excellent documentation: http://www.rivetsjs.com/

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


## A practical example

One of the biggest pain points in web development is working with forms. There are a ton of libraries for working with validation and rendering of forms both the client and the server but in my experience they are the most time consuming part of web development. This is an area where binding (two-way specifically) can make your life easier.

As an example, let's work with a form that creates and edits user information.

### Contact Manager Form (without binding):

Given this form: 




Here we have our form code for editing and creating a user
* Here's how this would work with just vanilla backbone
* We have a view (the form) that we want to sync with a model (the user)
* As you can see in this example, when I want to save model, I've got to manually map the values from view to the model and then save the model. 
* On a smaller form this isn't a huge deal but on larger more complex forms it becomes an issue.
* Now imagine we have a preview of the user's contact card as well, now we'd have to wire up and manually update that view as well.
* Show preview of card. This would get tedious.

### Contact Manager Form (with binding)
* Here's the same code but now I've added a bind method and a few binding 
* As you can see the values I type in the form are reflected immediately in the card view since both views are bound to the same model without any of the nasty glue in my view
* Rivets handles the glue, both binding and unbinding
* The glue is in the template which is where it belongs IMO. 
* Just like you wouldn't write your HTML rendering in your JS view, neither should you write your binding code in your JS view. 
* The way data is displayed should be left to the template. The view should only care about the data being presented and events that can act on that day.




