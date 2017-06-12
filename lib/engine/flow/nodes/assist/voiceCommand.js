var COMMAND = {'Turn on the light': 3, 'Turn Red': 4, 'Turn Blue': 5, 'Turn Green': 6,'Turn White':7,'More light':8,'Less light':9,'Lights off':10,'Motor Forward':11,'Motor Backward':12,'Speed Up':13,'Speed Down':14,'Love':15,'Smile':16,'Angry':17,'Sad':18,'Rock and roll':19,'Fire Fire':20,'Game start':21,'Winter is coming':22,'Start':23,'Shut down':24};
var node = {
  name: 'VOICECOMMAND',
  conf: {command:null},
  props: {
    'category': 'VOISERECOGNITION',
    'assistanceNode': true,
    'in': ['voice'],
    'out': ['result'],
     'configs':{ 
      command: {type: 'options', options: ['Turn on the light','Turn Red','Turn Blue','Turn Green','Turn White','More light','Less light','Lights off','Motor Forward','Motor Backward','Speed Up','Speed Down','Love','Smile','Angry','Sad','Rock and roll','Fire Fire','Game start','Winter is coming','Start','Shut down'],defaultValue: 'Turn on the light'}
    }   
  },
  run: function() {
    var that = this;
    var voice = that.in('voice');
    if ((typeof voice === 'object') && (voice !== null)){
       if (voice.hasOwnProperty('voiceRecognition')){
         if (voice.voiceRecognition === COMMAND[that.conf.command]){
           that.out('result',true);
         } else {
           that.out('result',false);
         }
       } else {
         that.out('result',false);
       }
    } else {
      that.out('result',false);
    }
  }, 
  config: function(){
    this.out('result',false);
  },
  init: function() {

  }
};

module.exports = node;
