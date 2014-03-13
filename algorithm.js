var size;
var data = new Array();		// Raw data from JSON
var request = new XMLHttpRequest();
var matrix = new Array();	// Main money matrix
var mapping = new Array();	// Key for "matrix" array
var numpayto;	// Number of people to be paid
var numpayer; 	// Number of payers

/*
function init()
{
	request.open("GET", "debts.json", true);
	request.send(null);
	request.onreadystatechange = callback;
	
	function callback() 
	{
        if (request.readyState == 4 && request.status == 200) 
        {
        	var debtstr = request.responseText;
        	data = JSON.parse(debtstr);
			checkSize();
			createMatrix();
			algorithm();
        }
    }

}
*/

function init()
{
	data = {
			"debts":
			[
				{"Payer":"win","Amount":15, "PayTo":"riley", "Reason":""},
				{"Payer":"riley","Amount":7, "PayTo":"peter", "Reason":""},
				{"Payer":"riley","Amount":1, "PayTo":"michael", "Reason":""},
				{"Payer":"peter","Amount":11, "PayTo":"riley", "Reason":"A"},
				{"Payer":"peter","Amount":13, "PayTo":"michael", "Reason":"B"},
				{"Payer":"peter","Amount":8, "PayTo":"win", "Reason":"C"},
				{"Payer":"peter","Amount":20, "PayTo":"jack", "Reason":"D"},
				{"Payer":"jack","Amount":5, "PayTo":"win", "Reason":"Lunch"},
				{"Payer":"jack","Amount":6, "PayTo":"win", "Reason":"Dinner"},
				{"Payer":"win","Amount":8, "PayTo":"peter", "Reason":""},
				{"Payer":"win","Amount":3, "PayTo":"jack", "Reason":""}
			]
			}
	checkSize();
	createMatrix();
	algorithm();
	printResults();
}

function checkSize()	// Calculates required size for "matrix" array
{
	var payer = new Array();
	var payto = new Array();

	for(var i = 0; i<data["debts"].length; i++)
	{

		var duplicate = false;
		for (var j = 0; j<payer.length; j++)
		{
			var strpayer = data["debts"][i]["Payer"];
			var strtest = payer[j];

			if(strpayer == strtest)
			{
				duplicate = true;
			}
		}
		if(duplicate == false)
		{
			var name = data["debts"][i]["Payer"];
			payer[payer.length] = name;
		}

	}

	for(var i = 0; i<data["debts"].length; i++)
	{

		var duplicate = false;
		for (var j = 0; j<payto.length; j++)
		{
			var strpayto = data["debts"][i]["PayTo"];
			var strtest = payto[j];

			if(strpayto == strtest)
			{
				duplicate = true;
			}
		}
		if(duplicate == false)
		{
			var name = data["debts"][i]["PayTo"];
			payto[payto.length] = name;
		}
	}

	numpayto = payto.length;
	numpayer = payer.length;

	if(numpayto > numpayer)
	{
		mapping = payto;
	}
	else 
	{
		mapping = payer;
	}

	size = Math.max(numpayer, numpayto);

}


function createMatrix() // Creates and fills the "matrix" array
{
	matrix = new Array(size);
	for(var i = 0; i<size; i++)
	{
		matrix[i] = new Array(size);
	}
	for(var i = 0; i<size;i++)
	{
		for(var j = 0; j<size; j++)
		{
			matrix[i][j] = 0;
		}
	}

	for(var i = 0; i<data["debts"].length; i++)
	{
		var payer = data["debts"][i]["Payer"];
		var amount = data["debts"][i]["Amount"];
		var payto = data["debts"][i]["PayTo"];
		var payermap;
		var paytomap;

		for(var j=0; j<mapping.length;j++)
		{
			if(payer == mapping[j])
			{
				payermap = j;
			}
			if(payto == mapping[j])
			{
				paytomap = j;
			}
		}

		matrix[payermap][paytomap] += amount;
	}

}

function algorithm()	// The Algorithm. Simplifies the debts.
{
	console.log("Before algorithm");
	checkMatrix();
	
	// Cannot owe or pay self
	for(var i = 0; i<size; i++)
	{
		matrix[i][i] = 0;
	}

	// Bidirectional. Payments between 2 people. 
	for(var i = 0; i<size; i++)
	{
		for(var j = 0; j<size; j++)
		{
			if(matrix[i][j] != 0 && matrix[j][i] !=0)
			{
				if(matrix[i][j] > matrix[j][i])
				{
					var a = matrix[i][j]
					var b = matrix[j][i]
					matrix[i][j] = a-b;
					matrix[j][i] = 0
				}
				else if(matrix[i][j] > matrix[j][i])
				{
					var a = matrix[i][j]
					var b = matrix[j][i]
					matrix[i][j] = 0;
					matrix[j][i] = b-a;
				}
				else if(matrix[i][j] == matrix[j][i])
				{
					matrix[i][j] = 0;
					matrix[j][i] = 0;
				}
			}
		}
	}


	console.log("After algorithm");
	checkMatrix();
}

function checkMatrix()	// Prints out visual representation of "matrix" and key in console
{
	console.log(mapping);
	for(var i = 0; i<size; i++)
	{
		var printout="";
		for(var j=0; j<size; j++)
		{
			printout += matrix[i][j] + " | ";
		}
		console.log(printout);

	}

}

function printResults() // Prints out leftover debts
{
	for(var i = 0; i<size; i++)
	{
		for(var j = 0; j<size; j++)
		{
			if(matrix[i][j] != 0)
			{
				console.log(mapping[i] + " owes " + mapping[j] + " $" + matrix[i][j] + ".");
			}
		}
	}
}