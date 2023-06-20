const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const { post } = require("request")

const app = express()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})
app.post("/",function(req,res){
    const firstname = req.body.fname 
    const lastname = req.body.lname 
    const email =  req.body.email
    
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    app.post("/failure",function(req,res){
        res.redirect("/");
    })
    const jsonData = JSON.stringify(data);
    
    const url = "https://us14.api.mailchimp.com/3.0/lists/64697d4155"
    const options = {
        method: "POST",
        auth: "roxx:ccf06864aff26ec28d0d7ed5bbecefb8-us14"

    }
    const request = https.request(url, options, function(response){
        response.on("data",function(data){
            api_res=JSON.parse(data)

            if(response.statusCode === 200 && api_res.error_count === 0){
                res.sendFile(__dirname+"/success.html")
            }
            else{
                res.sendFile(__dirname+"/failure.html")
            }
        })
    })
    request.write(jsonData);
    request.send();
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})

//API key
// ccf06864aff26ec28d0d7ed5bbecefb8-us14

//List ID
//64697d4155    