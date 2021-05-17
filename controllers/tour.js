const asyncMiddleware = require('./../middleware/async');
const Tour = require('./../models/tour'); 
const operatorAuth = require('./../middleware/check-operator-auth');
const checkOperatorAuth = require('./../middleware/check-operator-auth');
const Joi = require('joi');
const TouringCountrie = require('./../models/touring-contries');


exports.getTourCtrl = [checkOperatorAuth, asyncMiddleware(async(req, res, next)=> {

    const tourList = await req.operatorData.getTours({ include: TouringCountrie });   

    
    res.status(200).send(
        {
            "data": tourList,
            
        }
    )

    

})];

exports.getTourById = [checkOperatorAuth, asyncMiddleware(async(req, res, next)=> {
    const tourId = req.params.tourId;

    const receivedTour = await req.operatorData.getTours({
        include: TouringCountrie,
        where: { id: tourId}
    });

    res.status(200).send({
        data: receivedTour
    });

})];

// exports.updateTour = [checkOperatorAuth, asyncMiddleware(async(req, res, next)=> {
//     res.send(req.body);
// })];


exports.postTour = [checkOperatorAuth, asyncMiddleware(async(req, res, next)=> {
    
    const {error} = tourValidationError(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    // const tour = {
    //            "tour_name": req.body.tour_name,
    //     "from_date": req.body.from_date,
    //      "to_date": req.body.to_date,
    //     "country": req.body.country,
    //      "multicity_travel": req.body.multicity_travel,
    //     "nature_of_travel": req.body.nature_of_travel,
    //    // "touringCountries": req.body.touringCountries
        
    // };

   
    

    const tour = await req.operatorData.createTour({
        "tour_name": req.body.tour_name,
        "from_date": req.body.from_date,
         "to_date": req.body.to_date,
        "country": req.body.country,
         "multicity_travel": req.body.multicity_travel,
        "nature_of_travel": req.body.nature_of_travel
    });

    req.tour = tour;


    let touringCo = [];
    if(tour) {
        for (let i = 0; i < req.body.touringCountries.length; i++) {
            let x = await tour.createTouringCountrie({
                "countryCode": req.body.touringCountries[i],
                "tourId": req.tour.id
            })
             touringCo.push(x);
        }
    }

      

    res.status(200).send({
        "data": tour,
        "touring": touringCo,
        "message": "New Tour has been created"
    })
    

})];


exports.deleteTour = [checkOperatorAuth, asyncMiddleware(async(req, res, next)=>{
    const tourId = req.body.tourId;

    

    const tourList = await req.operatorData.getTours({
        where: { id: tourId}
    });

    if(!tourList[0]) return res.status(401).send("Tour is not available")

    const countryList = await TouringCountrie.destroy({
        where: { tourId: tourId}
    })   


    const fetchedTour = tourList[0];
     await fetchedTour.destroy();
   
    
    res.status(200).send({
        "message": "Successfully Deleted",
        "data": tourList,
        "status": 1
    });
})];


exports.updateTour = [checkOperatorAuth, asyncMiddleware(async(req, res, next)=> {

    const tourId = req.body.tourId;
   // return res.send(tourId)

    const tourToBeUpdated = await req.operatorData.getTours({
        include: TouringCountrie,
        where: { id: tourId}
    });

    if(tourToBeUpdated.length < 1) throw new Error("no such product type id exist to update");

    const countryList = await TouringCountrie.destroy({
        where: { tourId: tourId}
    })  
   
    const toBe = {
        "tour_name": req.body.tour_name 
     }
     
     tourToBeUpdated[0].set(toBe); 
     
     await tourToBeUpdated[0].save();

     for (let i = 0; i < req.body.touringCountries.length; i++) {          

        
               let x = await TouringCountrie.create({
                "countryCode": req.body.touringCountries[i],
                "tourId": tourId
            });    

        
        
    }

 

    res.send(tourToBeUpdated);
    
})];

exports.updateTourw = [checkOperatorAuth, asyncMiddleware(async(req, res, next)=> {

    const tourId = req.body.tourId;

    const fetchedTour = await req.operatorData.getTours({
        include: TouringCountrie,
        where: { id: tourId}
    });

    if(fetchedTour.length < 1) throw new Error("no such product type id exist to update");
   
    fetchedTour.forEach( tour => {
        console.log(tour.touringCountries.id)
        let tria = TouringCountrie.findAll({
            where: {id: tour.touringCountries.id}
        }).then(dd => {
            console.log(dd)
        })

        
    })

 

    res.send(fetchedTour);
    
})];

function tourValidationError(message) {
    const Schema = Joi.object({
        tour_name: Joi.string().required(),
        from_date: Joi.date().required(),
        to_date: Joi.date().greater(Joi.ref('from_date')).required(),
        country: Joi.string().required(),
        multicity_travel: Joi.boolean().required(),
        nature_of_travel: Joi.string().required(),
        touringCountries: Joi.array().items(Joi.string()),
    });

    return Schema.validate(message);
}