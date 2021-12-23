import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // endpoint for filtering an image
  app.get('/filteredimage', async (req, res, next) => {
    // validate request
    const { query: { image_url } } = req;
    if (!image_url) {
      return res.status(400).send({ message: 'image_url is required' });
    }
    if (!image_url.endsWith('.jpg')) {
      return res.status(400).send({ message: 'image must be .jpg' });
    }

    // get and process image
    const processedImage = await filterImageFromURL(image_url);
    
    // send file then delete from disk
    res.sendFile(processedImage, (error) => {
      if (error) {
        next(error);
      } else {
        // delete the file from disk
        deleteLocalFiles([processedImage]);
      }
    });
  });  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();