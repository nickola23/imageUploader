const http = require('http');
const express = require('express');
const app = express();
const { StatusCodes } = require('http-status-codes');
require('express-async-errors');
const notFound= require('./middleware/NotFound')
const errorHandler = require('./middleware/errorHandler');
const { writeFileSync, readFileSync, unlink, readdirSync, statSync, unlinkSync } = require('fs');
const photoParser = require('./middleware/photoParser');
const { join } = require('path');


app.use(express.static('public'));
app.use(express.json());

const server = http.createServer(app);

app.post('/upload',photoParser, async (req, res)=>{
  await res.status(StatusCodes.OK).json({
    ok:true,
    message: 'picture uploaded successfully'
  });
})
app.get('/pictures/:start', async (req, res)=>{
    const start = req.params.start;
    const end = start+30;
    const basePath = join(__dirname, 'data')
    const data = readdirSync(basePath);
    const sliced = data.slice(start, end);
    let files = sliced.filter((filename) => {
      return statSync(`${basePath}/${filename}`).isFile();
    });
  
  let sorted = files.sort((a, b) => {
      let aStat = statSync(`${basePath}/${a}`),
          bStat = statSync(`${basePath}/${b}`);
      
      return new Date(bStat.mtime).getTime() - new Date(aStat.birthtime).getTime();
  });

    await res.status(StatusCodes.OK).json({
      ok: true,
      data: sorted
    })

})
app.get('/picture/:filename', async (req, res)=>{
    const filename = req.params.filename;
    await res.status(StatusCodes.OK).sendFile(join(__dirname,'data',filename))
});

app.delete('/picture/:filename', async (req, res)=>{
  const filename = req.params.filename;
  await unlinkSync(join(__dirname,'data',filename));
  await res.status(StatusCodes.OK).json({
    ok: true,
    message: `file ${filename} deleted successfully`
  })
})

app.use(notFound);
app.use(errorHandler);

const PORT  = process.env.PORT || 5000;

server.listen(PORT,() =>{
  console.log(`app listens on port ${PORT}`)
})