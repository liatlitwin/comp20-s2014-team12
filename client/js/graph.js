function createGraph() // Creates graphs and renders
{ 
    $(document).ready(function() {

        // Width and heigh of canvas
        var width = 800;
        var height = $(document).height()-100;

        var g = new Graph();
        g.edgeFactory.template.style.directed = true;

        // Import data from MongoLab here

        // Test data
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
        {"payer":"A","amount":0.02, "payee":"C", "Reason":"D"}];

        var render = function(r, n) {
                /* the Raphael set is obligatory, containing all you want to display */
                var set = r.set().push(
                    /* custom objects go here */
                    // fill color here = color of the node
                    r.rect(n.point[0]-40, n.point[1]-13, 80, 44).attr({"fill": "#66CCCC", r : "30px", "stroke-width" : 1})).push(
                    r.text(n.point[0], n.point[1] + 10, (n.label || n.id)).attr({"font-size":"15px"}));
                return set;
            };

        // Figuring out names of nodes / people
        var mapping = new Array();
        for(var i = 0; i<data.length; i++)
        {

            var duplicate = false;
            for (var j = 0; j<mapping.length; j++)
            {
                var strpayer = data[i]["payer"];
                var strtest = mapping[j];

                if(strpayer == strtest)
                {
                    duplicate = true;
                }
            }
            if(duplicate == false)
            {
                var name = data[i]["payer"];
                mapping[mapping.length] = name;
            }
        }
        for(var i = 0; i<data.length; i++)
        {

            var duplicate = false;
            for (var j = 0; j<mapping.length; j++)
            {
                var strpayer = data[i]["payee"];
                var strtest = mapping[j];

                if(strpayer == strtest)
                {
                    duplicate = true;
                }
            }
            if(duplicate == false)
            {
                var name = data[i]["payee"];
                mapping[mapping.length] = name;
            }
        }

        // Creating the nodes / people
        for(var i = 0; i<mapping.length;i++)
        {
            g.addNode(mapping[i], {render:render});
        }

        // Creating the edges / lines between node / people
        for(var i = 0; i<data.length; i++)
        {
            var payer = data[i]["payer"];
            var payee = data[i]["payee"];
            var amount = "$"+data[i]["amount"].toFixed(2);
            // stroke and fill color = line
            // fill in "label-style" = font color of $
            g.addEdge(payer,payee, {weight: 2, stroke : "#38503C", fill: "#38503C", directed: true, label : ""+amount, "label-style":{"font-size":13, fill: "#38503C"}});
        }

        //  Rendering canvas
        var layouter = new Graph.Layout.Spring(g);
        // Replace 'canvas' with name of div
        var renderer = new Graph.Renderer.Raphael('canvas', g, width, height);
        renderer.draw();
    });
}