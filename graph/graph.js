$(document).ready(function() {
    var width = $(document).width()-500;
    var height = $(document).height()-700;
    width = 700;
    height = 500;
    var g = new Graph();
    g.edgeFactory.template.style.directed = true;

    data = [
    {"payer":"peter","amount":4.74, "payee":"win", "Reason":""},
    {"payer":"peter","amount":4.74, "payee":"michael", "Reason":""},
    {"payer":"jack","amount":7.69, "payee":"win", "Reason":""},
    {"payer":"jack","amount":1.46, "payee":"riley", "Reason":"A"},
    {"payer":"jack","amount":7.69, "payee":"michael", "Reason":"B"},
    {"payer":"raewyn","amount":4.00, "payee":"michael", "Reason":"C"},
    {"payer":"liat","amount":0.49, "payee":"win", "Reason":"D"},
    {"payer":"liat","amount":6.75, "payee":"riley", "Reason":"D"},
    {"payer":"bobby","amount":24.92, "payee":"win", "Reason":"D"},
    {"payer":"A","amount":4.00, "payee":"B", "Reason":"D"},    
    {"payer":"A","amount":0.02, "payee":"C", "Reason":"D"}

                ]



    for(var i = 0; i<data.length; i++)
    {
        var payer = data[i]["payer"];
        var payee = data[i]["payee"];
        var amount = "$"+data[i]["amount"].toFixed(2);
        g.addEdge(payer,payee, {stroke :"#bfa", fill: "#56f", directed: true, label : ""+amount, "label-style":{"font-size":20}});
    }

    var layouter = new Graph.Layout.Spring(g);
    var renderer = new Graph.Renderer.Raphael('canvas', g, width, height);
    renderer.draw();
});