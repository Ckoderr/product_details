var express = require('express');
var router = express.Router();
var pool=require('./pool')
var fs=require("fs")
var upload=require('./multer')
/* GET home page. */
router.get('/product_interface',function(req,res,next) {
  res.render('productinterface',{message:''});
});


router.post('/product_submit',upload.single('picture'),function(req,res,next) {
  try{
    console.log("DATA",req.body)
    console.log("FILE",req.file)
    pool.query("insert into products(productname, producttypeid, productcategoryid, description, price, offer, quantity, quantitytype, productpicture) values(?,?,?,?,?,?,?,?,?)",[req.body.productname, req.body.producttypeid, req.body.productcategoryid, req.body.description, req.body.price, req.body.offer, req.body.quantity, req.body.quantitytype, req.file.filename],function(error,result){
      if(error)
      { console.log(error)
        res.render('productinterface' ,{message:'Database Error'});
      }
      else
      {
        res.render('productinterface',{message:'product submitted successfully...'});
      }
    })
  }

  catch(e)
  { console.log("Error",e)
    res.render('productinterface',{message:'Server Error'});
  }
 
});

router.get('/fetch_product_type',function(req,res,next) {

  try{

    pool.query(" select * from producttype",function(error,result){
      if(error)
      { console.log(error)
       res.status(200).json([])
      }
      else
      {
        res.status(200).json({result:result});
      }
    })
  }
  catch(e)
  { console.log("Error",e)
    res.render('productinterface',{message:'Server Error'});
  }
});

router.get('/fetch_product_category',function(req,res,next) {
  
  try{
    pool.query(" select * from productcategory where producttypeid=?",[req.query.typeid],function(error,result){
      if(error)
      { console.log(error)
       res.status(200).json([])
      }
      else
      {
        res.status(200).json({result:result});
      }
    })
  }
  catch(e)
  { console.log("Error",e)
    res.render('productinterface',{message:'Server Error'});
  }
});

router.get('/fetch_all_products',function(req,res,next) {
  
  try{
    pool.query( "select P.* ,(select PT.producttypename from producttype  PT where PT.producttypeid=P.producttypeid) as producttypename,(select PC.productcategoryname from productcategory PC where PC.productcategoryid=P.productcategoryid) as productcategoryname from products P",function(error,result) {
      if(error)
      { console.log( "D Error",error);
       res.render("displayallproducts",{data:[],message:"Database error"});
      }
      else
      {
        res.render("displayallproducts",{data:result,message:"Success"});
      }
    })
  }
  catch(e)
  { console.log(" Error",e);
  res.render("displayallproducts",{data:[],message:"server error"});
  }
});

router.get('/displayforedit',function(req,res,next) {
  
  try{
   
    pool.query( "select P.* ,(select PT.producttypename from producttype  PT where PT.producttypeid=P.producttypeid) as producttypename,(select PC.productcategoryname from productcategory PC where PC.productcategoryid=P.productcategoryid) as productcategoryname from products P where P.productid=?",[req.query.productid],function(error,result) {
      if(error)
      { console.log( "D error",error);
       res.render("displayforedit",{data:[],message:"Database error"});
      }
      else
      {
        res.render("displayforedit",{data:result[0],message:"Success"});
        
      }
    });
  }
  catch(e){
  console.log("D Error",e);
  res.render("displayforedit",{data:[],message:"server error"});
}
});
router.post('/edit_product',function(req,res){
 
  try{
    if(req.body.btn=="Edit")
    {
    pool.query(" update products set productname=?, producttypeid=?, productcategoryid=?, description=?, price=?, offer=?, quantity=?, quantitytype=? where productid=?",[req.body.productname, req.body.producttypeid, req.body.productcategoryid, req.body.description, req.body.price, req.body.offer, req.body.quantity, req.body.quantitytype,req.body.productid],function(error,result){
      if(error)
      { console.log(error);
        res.redirect('/products/fetch_all_products');
      }
      else
      {
        res.redirect('/products/fetch_all_products');
      }
    });
  }
      else
      {

        pool.query("delete from products where  productid=? ",[req.body.productid],function(error,result){
          if(error)
          { console.log(error);
            res.redirect('/products/fetch_all_products');
          }
          else
          {
            res.redirect('/products/fetch_all_products');
          }
        });

      }
     } catch(e) {
  { console.log("Error",e);
  res.redirect('/products/fetch_all_products');
  }
}
});
router.get('/displaypictureforedit',function(req,res,next) {
  res.render('displaypictureforedit',{data:req.query})
})

router.post('/edit_picture',upload.single('productpicture'),function(req,res){
 
  try{
    
    pool.query(" update products set productpicture=? where productid=? ",[req.file.filename,req.body.productid],function(error,result){
      if(error)
      { console.log("D Error",error);
        res.redirect('/products/fetch_all_products');
      }
      else
      {
        fs.unlinkSync(`D:/product_details/public/images/${req.body.oldfilename}`);
        res.redirect('/products/fetch_all_products');
      }
    });
  
     } catch(e) {
  { console.log(" D Error",e);
  res.redirect('/products/fetch_all_products');
  }
}
});

module.exports= router;
