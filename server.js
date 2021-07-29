const fs = require( 'fs' ),
      path = require( 'path' ),
      Twit = require( 'twit' ),
      config = require( path.join( __dirname, 'config.js' ) );

      const T = new Twit( config );

      function randomFromArray( images ){
        return images[Math.floor( Math.random() * images.length )];
      }

      function tweetRandomImage(){
        fs.readdir( __dirname + '/images', function( err, files ) {
          if ( err ){
            console.log( 'error:', err );
          }
          else{
            let images = [];
            files.forEach( function( f ) {
              images.push( f );
            } );
      
            console.log( 'opening an image...' );
      
            const imagePath = path.join( __dirname, '/images/' + randomFromArray( images ) ),
                  b64content = fs.readFileSync( imagePath, { encoding: 'base64' } );
      
            console.log( 'uploading an image...' );
      
            T.post( 'media/upload', { media_data: b64content }, function ( err, data, response ) {
              if ( err ){
                console.log( 'error:', err );
              }
              else{
                console.log( 'image uploaded, now tweeting it...' );
      
                T.post( 'statuses/update', {
                  media_ids: new Array( data.media_id_string )
                },
                  function( err, data, response) {
                    if (err){
                      console.log( 'error:', err );
                    }
                    else{
                      console.log( 'posted an image!' );
                    }
                  }
                );
              }
            } );      
          }
        } );
      }


      setInterval( function(){
        tweetRandomImage();
      }, 10000 );