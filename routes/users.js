var express = require('express');
var assert = require('assert');
var router = express.Router();

const rp = require('request-promise');
let url = 'http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite&ID=20';
const $ = require('cheerio');

const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const uri = 'mongodb+srv://the_flash:dQln0M0MrQVbONaU@cluster0-5pniq.mongodb.net/test'

const dbName = 'db_the_flash';

let NumbersProjects;
let project = [];
let year = [];

function findDatabase() {
  MongoClient.connect(uri, function (err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    db.collection("requests").find({}).toArray(function(err, result){
      if(err) throw err;
      console.log(result);
      return result;
      client.close();
    })
  });
}

function deleteData(titulo, data, situacao, sobre, regime, autor, ementa) {
  MongoClient.connect(uri, function (err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);
    var query = findDatabase();
    db.collection("requests").deleteMany(query, function(err, obj) {
      if (err) throw err;
      console.log(obj.result.n + " document(s) deleted");
      client.close();
    });
  });
}

function consultData(titulo, data, situacao, sobre, regime, autor, ementa) {
  MongoClient.connect(uri, function (err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);
    
    var obj = {
      name: `${titulo}`,
      date: `${data}`,
      situation: `${situacao}`,
      about: `${sobre}`,
      regime: `${regime}`,
      author: `${autor}`,
      menu: `${ementa}`
    };

    db.collection("requests").find({'name' : titulo}).count().then((cont) => {
      if (cont == 0) {
        db.collection("requests").insertOne(obj, function(err, res){
    
          if (err) throw err;
            console.log("document inserted");
            
            client.close()

            console.log("Title: ", titulo);
            console.log(" data: ", data);
            console.log(" situacao: ", situacao);
            console.log(" Assunto: ", sobre);
            console.log(" Regimes: ", regime);
            console.log(" autor: ", autor);
            console.log(" ementa: ", ementa);
            console.log("\n\n\n");

        });

      } else {
        console.log("Não vai cadastrar o titulo: ", titulo, " e a data: ", data);
          return false;
      }
      
    });
  });
}

function filterData() {

  rp(url).then((html) => {
    NumbersProjects = $ ('h5', html).text();
    var num = NumbersProjects.match(/\d/g);
    num = num.join("");
    var num2 = [];

    let n1 = 0;
    let n2 = 3;

    for (let i = 0; i < 10; i++){
    
        num2[i] = num.slice(n1, n2) + "#" + num.slice(n1+3, n2+4);
        n1 = n1 + 7;
        n2 = n2 + 7;
      
    }

    n1 = 70;
    n2 = 72;

    for (let i2 = 10; i2 < 15; i2++){
      
        num2[i2] = num.slice(n1, n2) + "#" + num.slice(n1+2, n2+4);
        n1 = n1 + 6;
        n2 = n2 + 6;
        
    }
    
    n1 = 100;
    n2 = 101;

    for (let i3 = 15; i3 < 16; i3++){
      
        num2[i3] = num.slice(n1, n2) + "#" + num.slice(n1+1, n2+4);
        n1 = n1 + 6;
        n2 = n2 + 6;
      
    }

    n1 = 105;
    n2 = 108;

    for (let i4 = 16; i4 < 18; i4++){
      
        num2[i4] = num.slice(n1, n2) + "#" + num.slice(n1+3, n2+4);
        n1 = n1 + 7;
        n2 = n2 + 7;
        
    }

    n1 = 119;
    n2 = 121;

    for (let i5 = 18; i5 < 21; i5++){
      
        num2[i5] = num.slice(n1, n2) + "#" + num.slice(n1+2, n2+4);
        n1 = n1 + 6;
        n2 = n2 + 6;
        
    }
    
    n1 = 137;
    n2 = 138;

    for (let i6 = 21; i6 < 22; i6++){
      
        num2[i6] = num.slice(n1, n2) + "#" + num.slice(n1+1, n2+4);
        
    }

    n1 = 142;
    n2 = 145;

    for (let i7 = 22; i7 < 29; i7++){
        num2[i7] = num.slice(n1, n2) + "#" + num.slice(n1+3, n2+4);
        n1 = n1 + 7;
        n2 = n2 + 7;
    }



    let teste = "";

    for (let n = 0; n < 29; n++) {
      teste = num2[n].split("#");
      project[n] = teste[0];
      year[n] = teste[1];  
      teste[0] = "";
      teste[1] = "";
    }

    let count = 0;

    for (let i7 = 0; i7 < 29; i7++) {
      for (let i8 = 1; i8 < 9; i8++) {

        if (project[i7] == 188 || project[i7] == 185 || project[i7] == 167) {

          rp(`http://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=20&inEspecie=${i8}&nrProjeto=${project[i7]}&aaProjeto=${year[i7]}`).then((html) => {
          
          var title = $ ('.card > .card-header > .card-title', html).text();
          title = title.split("Ementa")[0];
          
          var data = $ ('.card-subtitle', html).text();
          data = data.split(" ")[1];
          
          var situacao = $ ('div > div.col-lg > dl > dd:nth-child(2)', html).text();
          
          var assunto = $ ('div > div.col-lg > dl > dd:nth-child(8)', html).text();

          var regimes = $ ('div > div.col-lg > dl > dd:nth-child(6)', html).text();

          var autor = $ ('div > div.col-lg > dl > dd:nth-child(10)', html).text();
          
          if (project[i7] == 82 && year[i7] == 2017 || project[i7] == 3 && year[i7] == 2019 || project[i7] == 72 && year[i7] == 2015 || project[i7] == 86 && year[i7] == 2019) {
            var ementa = "Not working";
          } else {
            var ementa =  $ ('div > div:nth-child(5) > p', html).text();
          }
          
          if (title !== '') {            
            setTimeout(consultData, 5000, title, data, situacao, assunto, regimes, autor, ementa);
          }

          }).catch(function(err) {
            console.log("Eror")
          });
        }
      }
    }

  });

}

function deleteUm(){
  MongoClient.connect(uri, function (err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);
    
    db.collection("requests").find({}).toArray(function(err, result){
      if(err) throw err;
      db.collection("requests").deleteOne(result[4], function(err, obj) {
      if (err) throw err;
        console.log("1 document(s) deleted");
        client.close();
      });
      client.close();
    })

    
  });
}

findDatabase();

module.exports = router;