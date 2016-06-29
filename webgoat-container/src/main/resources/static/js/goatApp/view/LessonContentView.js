//LessonContentView
define(['jquery',
    'underscore',
    'backbone',
    'libs/jquery.form'], 
    function(
        $,
        _,
        Backbone,
        JQueryForm) {
    return Backbone.View.extend({
        el:'#lesson-content-wrapper', //TODO << get this fixed up in DOM

        initialize: function(options) {
            options = options || {};
        },

        render: function() {
            this.$el.html(this.model.get('content'));
            this.makeFormsAjax();
            this.ajaxifyAttackHref();
            $(window).scrollTop(0); //work-around til we get the scroll down sorted out
        },
        
        //TODO: reimplement this in custom fashion maybe?
        makeFormsAjax: function () {
            var options = {
                success:this.onAttackExecution.bind(this),
                url: this.model.urlRoot,
                type:'GET'
                // $.ajax options can be used here too, for example: 
                //timeout:   3000 
            };
            //hook forms //TODO: clarify form selectors later
            $("form.attack-form").ajaxForm(options);
        },

        ajaxifyAttackHref: function() {  // rewrite any links with hrefs point to relative attack URLs             
            var self = this;
            // The current LessonAdapter#getLink() generates a hash-mark link.  It will not match the mask below.
            // Besides, the new MVC code registers an event handler that will reload the lesson according to the route.
            $.each($('a[href^="attack?"]'),function(i,el) { //FIXME: need to figure out what to do here ...
                var url = $(el).attr('href');
                $(el).unbind('click').attr('href','#').attr('link',url);
                //TODO pull currentMenuId
                $(el).click(function(event) {
                    event.preventDefault();
                    var _url = $(el).attr('link');
                    console.log("About to GET " + _url);
                    $.get(_url)
                        .done(self.reLoadView.bind(self))
                        .fail(function() { alert("failed to GET " + _url); });
                });
            });
        },

        onAttackExecution: function(feedback) {
            console.log('attack executed')
            this.renderFeedback(feedback);
        },

        renderFeedback: function(feedback) {
            this.$el.find('feedback').html(feedback);
        }

    });

    
});
