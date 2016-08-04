define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'esri/layers/WebTiledLayer'
], function(
    declare,
    BaseWidget,
    WebTiledLayer
) {

var clazz = declare([BaseWidget], {
    //these two properties are defined in the BaseWiget
    baseClass: 'on-screen-boilerplate',
    name: 'TopPlaceHM',
    writelog :function(log,arguments){
      console.log(log, arguments);
    },
    postCreate: function() {
      this.inherited(arguments);
      this.writelog('TopPlace::postCreate', arguments);
    },
    // start up child widgets
    startup: function() {
        this.inherited(arguments);
        var conf = {
            multiplecheck : this.config.TP.params.multiplecheck,
            opacity : this.config.TP.params.opacity,
            api_key : this.config.TP.params.api_key,
            app_id :this.config.TP.params.app_id,
            apiurl : this.config.TP.params.apiurl,
            hmstyle : this.config.TP.params.hmstyle
        };
        if(conf.multiplecheck == 'on'){
            dojo.destroy("tp_hm_mr");
        }else{
            dojo.destroy("tp_hm_mc");
        }
        var map = this.map;
        var currentLayer = undefined;
        var currentLayers = [];
        dojo.query('.tp_hm input').on('change',function(){
            if (conf.multiplecheck == "on"){
                for(var x = 0; x < currentLayers.length; x++){
                    map.removeLayer(currentLayers[x]);
                }
                currentLayers = [];
                var items = dojo.query('#tp_hm_mc input:checked');
                for(var x = 0; x < items.length; x++){
                    var t = items[x].value;
                    var cl = new WebTiledLayer(conf.apiurl+"/v2/tile?appid=" + conf.app_id + "&appkey=" + conf.api_key + "&z=${level}&x=${col}&y=${row}&o=" + conf.opacity + "&v=02&t=" + t + "&s=" + conf.hmstyle,{
                        id:"TopPlace Heatmap: " + t
                    });
                    currentLayers.push(cl);
                    map.addLayer(cl);
                }
            }else {
                var t = dojo.byId(this.id).value;
                if (currentLayer) {
                    map.removeLayer(currentLayer);
                }
                if(t != "") {
                    currentLayer = new WebTiledLayer(conf.apiurl+"/v2/tile?appid=" + conf.app_id + "&appkey=" + conf.api_key + "&z=${level}&x=${col}&y=${row}&o=" + conf.opacity + "&v=02&t=" + t + "&s=" + conf.hmstyle,{
                        id:"TopPlace Heatmap: " + t
                    });
                    map.addLayer(currentLayer);
                }
            }

            /*
            var i = dojo.query('div[data-widget-name="TopPlaceHM"] img')[0];
            if(t != "") {
              currentLayer = new WebTiledLayer("http://pre-m.avuxiapis.com/v2/tile?appid="+app_id+"&appkey="+api_key+"&z=${level}&x=${col}&y=${row}&o="+opacity+"&v=02&t=" + t + "&s="+hmstyle);
              map.addLayer(currentLayer);

              i.src = i.src.replace('icon.png','icon_s.png');
            }else{
              i.src = i.src.replace('icon_s.png','icon.png');
            }
            */
        });

    },

    onOpen: function() {
        this.writelog('TopPlace::onOpen', arguments);
    },
    onClose: function() {
        this.writelog('TopPlace::onClose', arguments);
    }
  });

  return clazz;
});
