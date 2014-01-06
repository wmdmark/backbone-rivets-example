
# The Rivets adaptor for Backbone models. 
# See docs on adaptors here: http://www.rivetsjs.com/docs/#adapters

rivets.adapters[':'] =
  
  subscribe: (obj, keypath, callback) ->
    # Subscribes to the model->attribute change event
    obj.on "change:" + keypath, callback

  unsubscribe: (obj, keypath, callback) ->
    # Unsubscribes from the model->attribute change event
    # Used when View.unbind() is called
    obj.off "change:" + keypath, callback

  read: (obj, keypath) ->
    # Read a value from a model based on the watched key
    obj.get keypath

  publish: (obj, keypath, value) ->
    # Write a value to a model based on a watched key
    obj.set keypath, value

rivets.formatters.toArray = (collection) -> collection.models


class FormView extends Backbone.View

  el: "#form-view"

  render: ->
    # Normally you'd render a template here
    # but for this example the HTML is already in the DOM


class ContactView extends Backbone.View

  el: "#contact-view"

  render: ->
    # Normally you'd render a template here
    # but for this example the HTML is already in the DOM


$ ->
  contactModel = new Backbone.Model()
  new FormView(model: contactModel).render()
  new ContactView(model: contactModel).render()