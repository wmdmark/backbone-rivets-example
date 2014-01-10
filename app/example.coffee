"""
The Rivets adaptor for Backbone models. 
See docs on adaptors here: http://www.rivetsjs.com/docs/#adapters
This is a very simple Backbone adaptor. 
For more advanced binding check out: 
https://github.com/azproduction/rivets-backbone-adapter
"""
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


"""
The Backbone Model and Views for our example.
Normally these would be split into their own files but
for examples sake we're combinding everything here.
"""
class ContactModel extends Backbone.Model

  defaults:->
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


sampleData = require('sample-data')


class BoundView extends Backbone.View

  render: ->
    super()
    @bindingView = rivets.bind(@el, model: @model, view: @)
    @

  remove: ->
    @bindingView.unbind()
    super()
    

class ContactFormView extends BoundView
  el: "#contact-form-view"

class ContactView extends BoundView
  el: "#contact-view"

class ModelJSONView extends BoundView
  el: "#model-json-view"
  sampleData: require("sample-data")
  events:
    "click a": (e)->
      sampleData = 
      sample = $(e.currentTarget).data().sample
      @watched.clear(silent:yes)
      @watched.set(@sampleData[sample])

  initialize: (options)->
    @model ?= new Backbone.Model()
    @watched = options.watch
    @_setWatchedModelJSON()
    @listenTo @watched, "change", @_setWatchedModelJSON

  _setWatchedModelJSON: ->
    json = JSON.stringify(@watched.toJSON(), null, '  ')
    @model.set("modelJSON", json)


"""
Custom Rivets formatter to replace text line breaks with <br>s
See formatter docs here: http://www.rivetsjs.com/docs/#formatters
"""
rivets.formatters.linebreaksbr = (value)->
  return value.replace(/\n/g, '<br>')

"""
Custom Rivets binder to update value bindings "live" (onkeyup)
Bindings documentation here: http://www.rivetsjs.com/docs/#binders
"""
rivets.binders['live-value'] =
  publishes: true
  bind: (el) -> $(el).on 'keyup', @publish
  unbind: (el) -> $(el).off 'keyup', @publish
  routine: (el, value) -> rivets.binders.value.routine(el, value)


$ ->
  window.contactModel = new ContactModel()
  new ContactFormView(model: contactModel).render()
  new ContactView(model: contactModel).render()
  new ModelJSONView(watch: contactModel).render()

  