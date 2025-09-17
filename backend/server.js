const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const carList = require("./carlist.json");
const userList = require('./users.json');
const carHealth = require('./carhealth.json');
//const ordersData = require('./orders.json');
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's domain and port
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};


//app.use(cors(corsOptions));
app.use(cors());
app.options('*', cors())

app.use(express.json());
const { writeFile } = require('fs').promises;  // Import the promise version of writeFile


// Define the target API URL

//console.log("SANDY_URL ", process.env.CARS_GET_REMOTE_URL);
const axios = require('axios');

app.get("/car-service-redis/cars", async (req, res) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: process.env.CARSRENTAL_GETALL_HOST+process.env.LISTALL_CARS_REDIS_API,
    headers: { }
  };
  axios.request(config)
  .then((response) => {
    res.send(response.data);
    console.log("response.data get all cars ", response.data);
  })
  .catch((error) => {
    // console.log(error);
    res.send(error);
  });
  
  //res.send(carList);

})


app.get("/car-service-redis/cars/:id", async (req, res) => {
  const carId = req.params.id;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: process.env.CARSRENTAL_GETALL_HOST+process.env.LISTALL_CARS_REDIS_API+"/"+carId,
    headers: { }
  };

  axios.request(config)
  .then((response) => {
    res.send(response.data);
  })
  .catch((error) => {
    // console.log(error);
    res.send(error);
  });
});

  app.get("/car-health/cars/:car_id", async (req, res) => {
  const carId = req.params.car_id;
  console.log("userid ", carId);
  const carHealthD = carHealth.find((car_id) => {
    return car_id.carid === carId;
  });
  console.log("car health is ", carHealthD);
  res.send(carHealthD);
});


app.get("/order-service/user-orders", async (req, res) => {
  try {
    // Extract userid from request query parameters
    const userId = req.query.userid;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      // url: process.env.CARSRENTAL_GETALL_HOST+'/order-service/orders?userid=JohnC',
      url: "http://152.67.25.167/order-service/orders?userid=JohnC",
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      console.log("list of orders ",JSON.stringify(response.data));
      ordersData = response.data;
      let sortedOrders = ordersData.sort((a, b) => new Date(b.order_when) - new Date(a.order_when))
      let filteredOrders = sortedOrders.filter(order => order.userid === userId);
      console.log("Post filter list of orders ", filteredOrders);
      res.send(filteredOrders);


    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });


  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.post("/order-service/create-order", async (req, res) => {
  try {
    const payload = req.body;
    console.log("create order payload is ", payload);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.CARSRENTAL_GETALL_HOST+process.env.USER_CREATE_ORDER,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : payload
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });


  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ code: 1, msg: 'Internal Server Error' });
  }
});

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.post("/user-service-redis/authn", async (req, res) => {
  console.log('Before fetch request');
  const payload = await req.body;
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://152.67.25.167user-service-redis/authn',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : payload
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));

    //if(response.data.code === 0 && response.data.msg==="OK"){
      const loginResponse = response.data;
      loginResponse.userid = payload.userid;
      console.log(" with user id ", loginResponse);
      res.send(loginResponse);
    //}
    //let filteredUser = response.data.filter(user => user.userid === payload.userid)[0];
  })
  .catch((error) => {
    console.log(error);
    res.send({ code: 1, msg: 'KO', userid: payload.userid });
  });



});

app.get("/user-service-redis/users/:userid", async (req, res) => {
  const userID = req.params.userid;
  if(userID){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://152.67.25.167/user-service-redis/users/${userID}`,
    headers: { }
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    res.send(response.data);
  })
  .catch((error) => {
    console.log(error);
    res.send(error);
  });
} else {
  res.send("Error - Invalid User")
}

});

app.post("/askme-search", async (req, res) => {
  console.log('Before fetch request');
  const payload = await req.body;

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: 'http://152.67.25.167/opensearch/my_index/_search',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'basic auth '
    },
    data: payload
  };
  
  axios.request(config)
    .then((response) => {
      console.log(" response search data ", JSON.stringify(response.data));
      res.send(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
});


const port = 5050;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
