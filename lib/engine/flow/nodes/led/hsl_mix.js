var node = {
  name: 'HSL_MIX',
  methods: {report: null},
  conf: {},
  props: {
    'category': 'led',
    'outPutType': 'object',
    'in': ['hue','saturation','lightness'],
    'out': ['color']
  },
  run: function() {
    var that = this;
    var H = Number(that.in('hue'));
    var S = Number(that.in('saturation'));
    var L = Number(that.in('lightness'));
    var R,G,B,var_1,var_2;
    if (S === 0)                       //HSL from 0 to 1
    {
      R = L * 255;                      //RGB results from 0 to 255
      G = L * 255;
      B = L * 255;
    } else {
      if ( L < 0.5 ){
        var_2 = L * ( 1 + S );
      }  else {
        var_2 = ( L + S ) - ( S * L );
      }
      var_1 = 2 * L - var_2;

      R = 255 * Hue_2_RGB( var_1, var_2, H + ( 1 / 3 ) ); 
      G = 255 * Hue_2_RGB( var_1, var_2, H );
      B = 255 * Hue_2_RGB( var_1, var_2, H - ( 1 / 3 ) );
    }
    R = parseInt(R);
    G = parseInt(G);
    B = parseInt(B);
    var out = [R,G,B];
    if (that.methods.report){
      that.methods.report(that.id,out);
    }
    that.out('color', out);

    function Hue_2_RGB( v1, v2, vH ){             //Function Hue_2_RGB
      if ( vH < 0 ) vH += 1;
      if ( vH > 1 ) vH -= 1;
      if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
      if ( ( 2 * vH ) < 1 ) return ( v2 );
      if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
      return ( v1 );
    }
  },
  init: function() {

  }
};

module.exports = node;
