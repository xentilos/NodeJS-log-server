var http = require('http');
var fs = require('fs');
var os = require("os");

//create a server object:
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var url = require('url');
    var q = url.parse(req.url, true);

   // console.log(q.search); 

    var qdata = q.query; 
    //console.log(qdata);
    var txt = qdata.usr;
    //console.log(txt);
    if (qdata.usr != null && qdata.pc != null && qdata.segment != null ) {
        textformat(qdata);
    }
    if (qdata.pc != null && qdata.localadmin != null ) {
        textformat2(qdata);
    }
    if (qdata.outfile != null ) {
        CustomOutFile(qdata);
    }
    if (q.pathname == "/out") {
        outpage(req, res);
    }
    if (q.pathname == "/localadmin") {
        localadmin(req, res);
    }
    if (q.pathname == '/') {
        res.write('ok2');
        res.end();
    }
    if (q.pathname == '/custom' && qdata.file != null) {
        //res.write(qdata.file);
        //res.end();
        customLogPage(req, res, qdata.file);
    }
  //res.end(); //end the response
}).listen(8080); //the server object listens on port 8080

function textformat ( txt ) 
{
    var d = new Date();
    var strLine = txt.pc + ";" + txt.usr + ";" + txt.segment +";" +d.toUTCString()
    fs.appendFile('pc_list.txt',strLine + os.EOL , function (err) {
        if (err) throw err;
        console.log('Updated!');
    });
}
function textformat2 ( txt ) 
{
    var d = new Date();
    var strLine = txt.pc + ";" + txt.localadmin + ";" +d.toUTCString()
    fs.appendFile('pc_localadmin.txt',strLine + os.EOL , function (err) {
        if (err) throw err;
        console.log('Updated!');
    });
}
function CustomOutFile ( txt ) 
{
    var d = new Date();
    if (txt.arg3 == null) {
        var strLine = txt.arg1 + ";" + txt.arg2 + ";" + d.toUTCString()
    } else {
        var strLine = txt.arg1 + ";" + txt.arg2 + ";" + txt.arg3 + ";" + d.toUTCString()
    }
    var file = txt.outfile
    fs.appendFile(file +'.txt',strLine + os.EOL , function (err) {
        if (err) throw err;
        console.log('Updated!');
    });
}
function outpage(req, res) {

        fs.readFile('pc_list.txt' , function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            var tab = mytable(data);
            //console.log(tab);
            res.write(tab);
            res.end();
        });

}

function localadmin(req, res) {

    fs.readFile('pc_localadmin.txt' , function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var tab = mytable_localadmin(data);
        //console.log(tab);
        res.write(tab);
        res.end();
    });

}

function customLogPage(req, res, f) {
    if (fs.existsSync(f+'.txt')){
        fs.readFile(f+'.txt' , function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            //var tab = mytable_localadmin(data);
            var tab = myCustomTable(data);
            //console.log(tab);
            res.write(tab);
            res.end();
        });

    }
}

function mytable(filetable) {
    var arr = []
    var table =""
    var data = filetable.toString().split(/\n/)
    data.forEach(function(element) {
        var t =element.toString().split(';');
        var tt = {"pc":t[0],"usr":t[1],"segment":t[2],"date":t[3]}
        arr.push(tt)
    }, this);
    //console.log(arr);
    table = table +"<table border='1'>" + "\r\n" 
    arr.forEach(function(element) {
        if(element.pc != "") {
            table = table + "<tr>" +  "\r\n" +
            "<td>" + "\r\n" +
            element.pc +  "\r\n" +
            "</td>" + "\r\n" +
            "<td>" + "\r\n" +
            element.usr +  "\r\n" +
            "</td>" + "\r\n" +
            "<td>" + "\r\n" +
            element.segment + "\r\n" + 
            "</td>" + "\r\n" +
            "<td>" + "\r\n" +
            element.date +  "\r\n" +
            "</td>" + "\r\n" +
            "</tr>" + "\r\n" 
        }
    });
    table = table +"</table>"

    var body ='<html>'+  "\r\n"+
    '<head>'+ "\r\n"+
    '<meta http-equiv="Content-Type" content="text/html; '  + "\r\n" +
    'charset=UTF-8" />'  + "\r\n" +
    '</head>'  + "\r\n" +
    '<body>' + "\r\n" +
    '<p><div>Logs</div></p>' + table+
    '</body>'  + "\r\n" +
    '</html>';
    //console.log(table);
    return body;
}

function mytable_localadmin(filetable) {
    var arr = []
    var table =""
    var data = filetable.toString().split(/\n/)
    data.forEach(function(element) {
        var t =element.toString().split(';');
        var tt = {"pc":t[0],"localadmin":t[1],"date":t[2]}
        arr.push(tt)
    }, this);
    //console.log(arr);
    table = table +"<table border='1'>" + "\r\n" 
    arr.forEach(function(element) {
        if(element.pc != "") {
            table = table + "<tr>" +  "\r\n" +
            "<td>" + "\r\n" +
            element.pc +  "\r\n" +
            "</td>" + "\r\n" +
            "<td>" + "\r\n" +
            element.localadmin +  "\r\n" +
            "</td>" + "\r\n" +
            "<td>" + "\r\n" +
            element.date + "\r\n" + 
            "</td>" + "\r\n" +
            "</tr>" + "\r\n" 
        }
    });
    table = table +"</table>"

    var body ='<html>'+  "\r\n"+
    '<head>'+ "\r\n"+
    '<meta http-equiv="Content-Type" content="text/html; '  + "\r\n" +
    'charset=UTF-8" />'  + "\r\n" +
    '</head>'  + "\r\n" +
    '<body>' + "\r\n" +
    '<p><div>Logs</div></p>' + table+
    '</body>'  + "\r\n" +
    '</html>';
    //console.log(table);
    return body;
}


function myCustomTable(filetable) {
    var arr = []
    var table =""
    var data = filetable.toString().split(/\n/)
    data.forEach(function(element) {
        var t =element.toString().split(';');
        
        //var tt = {"arg1":t[0],"arg2":t[1],"date":t[2]}
        if (t.length ==3 ){
            var tt = {"arg1":t[0],"arg2":t[1],"date":t[2]}
        } 
        if (t.length == 4 ) {
            var tt = {"arg1":t[0],"arg2":t[1],"arg3":t[2],"date":t[3]}
        } 
        if (t.length > 4 ) {
            var tt = {"arg1":t[0],"arg2":t[1],"arg3":t[2],"date":t[t.length-1]}
        } 
        if (t.length == 1 )  {
            var tt = {"arg1":t[0]}
        }

        arr.push(tt)
    }, this);
    //console.log(arr);
    table = table +"<table border='1'>" + "\r\n" 
    arr.forEach(function(element) {
        //console.log(element.arg1)
        if(element.arg1 != "") {
            //if(element.date == null) {element.date=""}
            table = table + "<tr>" +  "\r\n" +
            "<td>" + "\r\n" +
            element.arg1 +  "\r\n" +
            "</td>" + "\r\n" +
            "<td>" + "\r\n" +
            element.arg2 +  "\r\n" +
            "</td>" + "\r\n" +
            
            "<td>" + "\r\n" +
            element.arg3 +  "\r\n" +
            "</td>" + "\r\n" +

            "<td>" + "\r\n" +
            element.date + "\r\n" + 
            "</td>" + "\r\n" +
            "</tr>" + "\r\n" 
        }
    });
    table = table +"</table>"

    var body ='<html>'+  "\r\n"+
    '<head>'+ "\r\n"+
    '<meta http-equiv="Content-Type" content="text/html; '  + "\r\n" +
    'charset=UTF-8" />'  + "\r\n" +
    '</head>'  + "\r\n" +
    '<body>' + "\r\n" +
    '<p><div>Logs</div></p>' + table+
    '</body>'  + "\r\n" +
    '</html>';
    //console.log(table);
    return body;
}