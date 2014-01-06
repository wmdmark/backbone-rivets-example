"""
The Rivets adaptor for Backbone models. 
See docs on adaptors here: http://www.rivetsjs.com/docs/#adapters
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
Custom Rivets formatter to replace text line breaks with <br>s
See formatter docs here: http://www.rivetsjs.com/docs/#formatters
"""
rivets.formatters.linebreaksbr = (value)->
  return value.replace(/\n/g, '<br>')



"""
The Backbone Model and Views for our example.
Normally these would be split into their own files but
for examples sake we're combinding everything here.
"""
class ContactModel extends Backbone.Model

  url: "contacts/"

  defaults:->
    first_name: ""
    last_name: ""
    short_bio: ""
    links:
      github: ""
      twitter: ""
      website: ""

  getGravatar: ->
      return "" if not @get("email")
      baseURL = "http://www.gravatar.com/avatar/"
      imgPath = hex_md5(@get('email'))
      "#{baseURL}/#{imgPath}"

  getFullName: -> 
    "#{@get('first_name')} #{@get('last_name')}"

  hasLinks: =>
    vs = _.uniq(_.values(@get("links")))
    !(vs.length is 1 and vs[0] is "")

class ContactFormView extends Backbone.View

  el: "#contact-form-view"

  events:
    "keyup textarea": (e)-> 
      $(e.currentTarget).trigger("change")

  render: ->
    # Normally you'd render a template here
    # but for this example the HTML is already in the DOM
    @bindingView = rivets.bind(@el, contact: @model, view: @)

  remove: ->
    # Need to unbind rivets first
    @bindingView.unbind()
    super()

  loadSample: =>
    @model.set
      first_name: "Mark"
      last_name: "Johnson"
      short_bio: "Web designer, developer and teacher. Co-founder of Pathwright"
      email: "wmdmark@gmail.com"
      links:
        twitter: "http://twitter.com/wmdmark"
        github: "http://github.com/wmdmark"
        website: "http://pathwright.com"
    return false


class ContactView extends Backbone.View

  el: "#contact-view"

  render: ->
    # Normally you'd render a template here
    # but for this example the HTML is already in the DOM
    @bindingView = rivets.bind(@el, contact: @model)
    @

  remove: ->
    # Need to unbind rivets first
    @bindingView.unbind()
    super()


$ ->
  window.contactModel = new ContactModel()
  contactModel.on "change", -> 
    console.log(@attributes)
  new ContactFormView(model: contactModel).render()
  new ContactView(model: contactModel).render()