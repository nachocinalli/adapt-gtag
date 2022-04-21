import Adapt from 'core/js/adapt';
class AdaptGtag extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, 'app:dataReady', this.onDataReady);
  }

  sendEvent(eventName, eventParams) {
    // eslint-disable-next-line no-undef
    gtag('event', eventName, eventParams);
  }

  onTrackingComplete(completionData) {

    const _tracking = {
      title: Adapt.course.get('title'),
      status: completionData.status.asLowerCase
    };

    this.sendEvent('tracking:complete', _tracking);
  }

  onQuestionRecordInteraction(questionView) {
    const responseType = questionView.getResponseType();
    if (_.isEmpty(responseType)) return;
    const _interaction = {
      id: questionView.model.get('_id'),
      title: questionView.model.get('title'),
      response: questionView.getResponse(),
      result: questionView.isCorrect()
    };
    this.sendEvent('questionView:recordInteraction', _interaction);
  }

  onDataReady() {
    const config = Adapt.config.get('_gtag');

    if (!config || !config._isEnabled) return;

    $('head').append(Handlebars.templates.gtag(config));

    Adapt.on({
      'questionView:recordInteraction': this.onQuestionRecordInteraction.bind(this),
      'tracking:complete': this.onTrackingComplete.bind(this)
    });
    // this.listenTo(Adapt.course, 'bubble:change:_isComplete', this.onCompletionChange);
  }
}
export default new AdaptGtag();
