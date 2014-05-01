var alg_size;
var alg_data = new Array();		// Raw alg_data from JSON
var alg_request = new XMLHttpRequest();
var alg_matrix = new Array();	// Main money alg_matrix
var alg_mapping = new Array();	// Key for "alg_matrix" array
var alg_numpayto;	// Number of people to be paid
var alg_numpayer; 	// Number of payers
var starttotal=0;	// Number of dollars in transfer before algorithm
var endtotal=0;	// Number of dollars in transfer after algorithm
var alg_changed = true;


function init(trans)
{

    alg_data = trans;
    checkSize();
    createMatrix();
    checkMatrix();
    algorithm();
    checkMatrix();
    return sendResults();
}

function checkSize()	// Calculates required alg_size for "alg_matrix" array
{
    for(var i = 0; i<alg_data.length; i++)
    {

        var duplicate = false;
        for (var j = 0; j<alg_mapping.length; j++)
        {
            var strpayer = alg_data[i]["payer"];
            var strtest = alg_mapping[j];

            if(strpayer == strtest)
            {
                duplicate = true;
            }
        }
        if(duplicate == false)
        {
            var name = alg_data[i]["payer"];
            alg_mapping[alg_mapping.length] = name;
        }

    }

    for(var i = 0; i<alg_data.length; i++)
    {

        var duplicate = false;
        for (var j = 0; j<alg_mapping.length; j++)
        {
            var strpayto = alg_data[i]["payee"];
            var strtest = alg_mapping[j];

            if(strpayto == strtest)
            {
                duplicate = true;
            }
        }
        if(duplicate == false)
        {
            var name = alg_data[i]["payee"];
            alg_mapping[alg_mapping.length] = name;
        }
    }
    alg_size = alg_mapping.length;
}


function createMatrix() // Creates and fills the "alg_matrix" array
{
    alg_matrix = new Array(alg_size);
    for(var i = 0; i<alg_size; i++)
    {
        alg_matrix[i] = new Array(alg_size);
    }
    for(var i = 0; i<alg_size;i++)
    {
        for(var j = 0; j<alg_size; j++)
        {
            alg_matrix[i][j] = 0.00;
        }
    }

    for(var i = 0; i<alg_data.length; i++)
    {
        var payer = alg_data[i]["payer"];
        var amount = alg_data[i]["amount"];
        var payto = alg_data[i]["payee"];
        var payermap;
        var paytomap;

        for(var j=0; j<alg_mapping.length;j++)
        {
            if(payer == alg_mapping[j])
            {
                payermap = j;
            }
            if(payto == alg_mapping[j])
            {
                paytomap = j;
            }
        }

        alg_matrix[payermap][paytomap] += amount;
        alg_matrix[payermap][paytomap] = Math.round(alg_matrix[payermap][paytomap]*100)/100;
    }

    for(var i = 0; i<alg_size; i++)
    {
        for(var j = 0; j<alg_size; j++)
        {
            starttotal += alg_matrix[i][j];
        }
    }

}

function algorithm()	// The Algorithm. Simplifies the debts.
{
    alg_changed = true;
    while (alg_changed == true)
    {
        alg_changed = false;
        var x;
        var y;
        var z;
        var xamount;
        var yamount;
        for(var i = 0; i<alg_size; i++)
        {
            for(var j = 0; j<alg_size; j++)
            {
                xamount = alg_matrix[i][j];
                x = i;
                y = j;
                for(var k =  0; k<alg_size; k++)
                {
                    var action = false;

                    // Bidirectional - Debt between 2 people
                    if(alg_matrix[i][j] != 0 && alg_matrix[j][i] !=0)
                    {
                        if(alg_matrix[i][j] > alg_matrix[j][i])
                        {
                            var a = alg_matrix[i][j]
                                var b = alg_matrix[j][i]
                                alg_matrix[i][j] = a-b;
                            alg_matrix[j][i] = 0
                                alg_changed = true;
                            action = true;
                        }
                        else if(alg_matrix[i][j] > alg_matrix[j][i])
                        {
                            var a = alg_matrix[i][j]
                                var b = alg_matrix[j][i]
                                alg_matrix[i][j] = 0;
                            alg_matrix[j][i] = b-a;
                            alg_changed = true;
                            action = true;
                        }
                        else if(alg_matrix[i][j] == alg_matrix[j][i])
                        {
                            alg_matrix[i][j] = 0;
                            alg_matrix[j][i] = 0;
                            alg_changed = true;
                            action = true;
                        }
                    }
                    yamount = alg_matrix[j][k];
                    // Person A can exactly pay Person B's debt
                    if(xamount == yamount && xamount != 0 && yamount != 0 && x !=k)
                    {
                        alg_matrix[j][k] = 0
                            alg_matrix[i][k] = xamount;
                        alg_changed = true;
                        action = true;
                    }
                    // Person A pays part of Person B's debt to Person C 
                    else if(xamount < yamount && xamount != 0 && yamount!= 0 && x!=k)
                    {
                        alg_matrix[i][k] = xamount;
                        alg_matrix[j][k] = yamount-xamount;
                        alg_matrix[i][j] = 0;
                        alg_changed = true;
                        action = true;
                    }
                    // Person A pays all of Person B's debt to Person C and pays Person B
                    else if(xamount > yamount && xamount != 0 & yamount != 0 && x!=k)
                    {
                        alg_matrix[i][k] = yamount;
                        alg_matrix[j][k] = 0;
                        alg_matrix[i][j] = xamount - yamount;
                        alg_changed = true;
                        action = true;
                    }

                    if(action == true)
                    {
                        checkMatrix();
                    }

                    alg_matrix[i][j] = Math.round(alg_matrix[i][j]*100)/100;
                    alg_matrix[i][k] = Math.round(alg_matrix[i][k]*100)/100;
                    alg_matrix[j][i] = Math.round(alg_matrix[j][i]*100)/100;
                    alg_matrix[j][k] = Math.round(alg_matrix[j][k]*100)/100;
                    alg_matrix[k][j] = Math.round(alg_matrix[k][j]*100)/100;
                    alg_matrix[k][i] = Math.round(alg_matrix[k][i]*100)/100;
                }
            }
        }
    }
}

function checkMatrix()	// Prints out visual representation of "alg_matrix" and key in console
{
    //console.log(alg_mapping);
    for(var i = 0; i<alg_size; i++)
    {
        var printout="";
        for(var j=0; j<alg_size; j++)
        {
            printout += alg_matrix[i][j] + " | ";
        }
        //console.log(printout);

    }

}

function sendResults() // Sends final outcome to alg_database
{
    finastr = "";
    for(var i = 0; i<alg_size; i++)
    {
        for(var j = 0; j<alg_size; j++)
        {
            endtotal += alg_matrix[i][j];
        }
    }
    var finalarray = new Array();
    var diff = (starttotal - endtotal);

    diff = diff.toFixed(2);

    var numtrans = 0;
    for(var i = 0; i<alg_size; i++)
    {
        for(var j = 0; j<alg_size; j++)
        {
            if(alg_matrix[i][j] != 0)
            {
                numtrans++;
                var finalpayer = alg_mapping[i];
                var finalpayee = alg_mapping[j];
                var finalamount = alg_matrix[i][j].toFixed(2);
                
                finalarray[finalarray.length] = {"payer":finalpayer, "payee": finalpayee, "amount": finalamount};
            }
        }
    }
    finalstr = JSON.stringify(finalarray);
    endtotal = 0;
    numtrans = 0;
    return finalstr;
}
