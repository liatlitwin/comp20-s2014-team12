var size;
var data = new Array();		// Raw data from JSON
var request = new XMLHttpRequest();
var matrix = new Array();	// Main money matrix
var mapping = new Array();	// Key for "matrix" array
var numpayto;	// Number of people to be paid
var numpayer; 	// Number of payers
var starttotal=0;	// Number of dollars in transfer before algorithm
var endtotal=0;	// Number of dollars in transfer after algorithm
var changed = true;


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
			printResults();
			checkMatrix();
			algorithm();
			checkMatrix();
			sendResults();
        }
    }

}


/*
function init()
{
	data = {
			"debts":
				[
	{"payer":"win","Amount":15.23, "PayTo":"riley", "Reason":""},
	{"payer":"riley","Amount":7.75, "PayTo":"peter", "Reason":""},
	{"payer":"riley","Amount":1.97, "PayTo":"michael", "Reason":""},
	{"payer":"peter","Amount":11.24, "PayTo":"riley", "Reason":"A"},
	{"payer":"peter","Amount":13.82, "PayTo":"michael", "Reason":"B"},
	{"payer":"peter","Amount":8.73, "PayTo":"win", "Reason":"C"},
	{"payer":"peter","Amount":20.00, "PayTo":"jack", "Reason":"D"},
	{"payer":"jack","Amount":5.97, "PayTo":"win", "Reason":"Lunch"},
	{"payer":"jack","Amount":6.43, "PayTo":"win", "Reason":"Dinner"},
	{"payer":"win","Amount":8.24, "PayTo":"peter", "Reason":""},
	{"payer":"win","Amount":3.10, "PayTo":"jack", "Reason":""},
	{"payer":"win","Amount":7.00, "PayTo":"riley", "Reason":""},
	{"payer":"riley","Amount":8.94, "PayTo":"peter", "Reason":""},
	{"payer":"peter","Amount":9.12, "PayTo":"jack", "Reason":"A"},
	{"payer":"jack","Amount":10.48, "PayTo":"michael", "Reason":"Dinner"},
	{"payer":"michael","Amount":11.69, "PayTo":"win", "Reason":""},
	{"payer":"riley","Amount":7.28, "PayTo":"win", "Reason":""},
	{"payer":"peter","Amount":6.91, "PayTo":"riley", "Reason":""},
	{"payer":"jack","Amount":7.69, "PayTo":"peter", "Reason":"A"},
	{"payer":"jack","Amount":9.97, "PayTo":"win", "Reason":"Dinner"},
	{"payer":"jack","Amount":15.99, "PayTo":"michael", "Reason":""},
	{"payer":"raewyn","Amount":8.99, "PayTo":"michael", "Reason":""},
	{"payer":"win","Amount":4.99, "PayTo":"raewyn", "Reason":""},
	{"payer":"liat","Amount":7.24, "PayTo":"win", "Reason":""},
	{"payer":"bobby","Amount":24.92, "PayTo":"win", "Reason":""},
	{"payer":"win","Amount":11.49, "PayTo":"michael", "Reason":""},
	{"payer":"jack","Amount":15.99, "PayTo":"michael", "Reason":""},
	{"payer":"nicki","Amount":0, "PayTo":"", "Reason":""},
	{"payer":"A","Amount":5, "PayTo":"B", "Reason":""},
	{"payer":"B","Amount":1, "PayTo":"C", "Reason":""},
	{"payer":"C","Amount":0.98, "PayTo":"A", "Reason":""}	
				]
			}
			checkSize();
			createMatrix();
			//printResults();
			checkMatrix();
			algorithm();
			checkMatrix();
			printResults();
}
*/

function checkSize()	// Calculates required size for "matrix" array
{
	for(var i = 0; i<data["debts"].length; i++)
	{

		var duplicate = false;
		for (var j = 0; j<mapping.length; j++)
		{
			var strpayer = data["debts"][i]["payer"];
			var strtest = mapping[j];

			if(strpayer == strtest)
			{
				duplicate = true;
			}
		}
		if(duplicate == false)
		{
			var name = data["debts"][i]["payer"];
			mapping[mapping.length] = name;
		}

	}

	for(var i = 0; i<data["debts"].length; i++)
	{

		var duplicate = false;
		for (var j = 0; j<mapping.length; j++)
		{
			var strpayto = data["debts"][i]["PayTo"];
			var strtest = mapping[j];

			if(strpayto == strtest)
			{
				duplicate = true;
			}
		}
		if(duplicate == false)
		{
			var name = data["debts"][i]["PayTo"];
			mapping[mapping.length] = name;
		}
	}
	size = mapping.length;
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
			matrix[i][j] = 0.00;
		}
	}

	for(var i = 0; i<data["debts"].length; i++)
	{
		var payer = data["debts"][i]["payer"];
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
		matrix[payermap][paytomap] = Math.round(matrix[payermap][paytomap]*100)/100;
	}

	for(var i = 0; i<size; i++)
	{
		for(var j = 0; j<size; j++)
		{
			starttotal += matrix[i][j];
		}
	}

}

function algorithm()	// The Algorithm. Simplifies the debts.
{

		changed = true;
		while (changed == true)
		{
			changed = false;
			var x;
			var y;
			var z;
			var xamount;
			var yamount;
			for(var i = 0; i<size; i++)
			{
				for(var j = 0; j<size; j++)
				{
					xamount = matrix[i][j];
					x = i;
					y = j;
					for(var k =  0; k<size; k++)
					{
						var action = false;

						// Bidirectional - Debt between 2 people
						if(matrix[i][j] != 0 && matrix[j][i] !=0)
						{
							if(matrix[i][j] > matrix[j][i])
							{
								var a = matrix[i][j]
								var b = matrix[j][i]
								matrix[i][j] = a-b;
								matrix[j][i] = 0
								changed = true;
								action = true;
							}
							else if(matrix[i][j] > matrix[j][i])
								{
								var a = matrix[i][j]
								var b = matrix[j][i]
								matrix[i][j] = 0;
								matrix[j][i] = b-a;
								changed = true;
								action = true;
							}
							else if(matrix[i][j] == matrix[j][i])
							{
								matrix[i][j] = 0;
								matrix[j][i] = 0;
								changed = true;
								action = true;
							}
						}


						yamount = matrix[j][k];
						

						// Person A can exactly pay Person B's debt
						if(xamount == yamount && xamount != 0 && yamount != 0 && x !=k)
						{
							matrix[j][k] = 0
							matrix[i][k] = xamount;
							changed = true;
							action = true;


						}
						// Person A pays part of Person B's debt to Person C 
						else if(xamount < yamount && xamount != 0 && yamount!= 0 && x!=k)
						{
							matrix[i][k] = xamount;
							matrix[j][k] = yamount-xamount;
							matrix[i][j] = 0;
							changed = true;
							action = true;

						}
						// Person A pays all of Person B's debt to Person C and pays Person B
						else if(xamount > yamount && xamount != 0 & yamount != 0 && x!=k)
						{
							matrix[i][k] = yamount;
							matrix[j][k] = 0;
							matrix[i][j] = xamount - yamount;
							changed = true;
							action = true;
						}

						if(action == true)
						{
							checkMatrix();
						}

						matrix[i][j] = Math.round(matrix[i][j]*100)/100;
						matrix[i][k] = Math.round(matrix[i][k]*100)/100;
						matrix[j][i] = Math.round(matrix[j][i]*100)/100;
						matrix[j][k] = Math.round(matrix[j][k]*100)/100;
						matrix[k][j] = Math.round(matrix[k][j]*100)/100;
						matrix[k][i] = Math.round(matrix[k][i]*100)/100;
					}
				}
			}
		}
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

function sendResults() // Sends final outcome to database
{
	for(var i = 0; i<size; i++)
	{
		for(var j = 0; j<size; j++)
		{
			endtotal += matrix[i][j];
		}
	}
	var finalstr = "";
	var diff = (starttotal - endtotal);
	diff = diff.toFixed(2);
	var numtrans = 0;
	for(var i = 0; i<size; i++)
	{
		for(var j = 0; j<size; j++)
		{
			if(matrix[i][j] != 0)
			{
				numtrans++;
				var finalpayer = mapping[i];
				var finalpayee = mapping[j];
				var finalamount = matrix[i][j].toFixed(2);
				var finalstr = {"payer":finalpayer,"payee":payee,"amount":finalamount};
			}
		}
	}
	endtotal = 0;
	numtrans = 0;
}
