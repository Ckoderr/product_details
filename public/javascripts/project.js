$(document).ready(function() {
    $.getJSON("/products/fetch_product_type",function(data) {
        var data = data.result;
       
        data.map((item, i)=> {
            
        $("#producttypeid").append(
            $("<option>").text(item.producttypename).val(item.producttypeid)
            );
        
          });
        });
  
        $('#producttypeid').change(function(){
          $.getJSON("/products/fetch_product_category",{typeid:$('#producttypeid').val()},function(data) {
            var data = data.result;
            $('#productcategoryid').empty()
            $('#productcategoryid').append(
              $("<option>").text('-Select category-'))
          
            data.map((item, i)=> {
                
            $("#productcategoryid").append(
                $("<option>").text(item.productcategoryname).val(item.productcategoryid)
                );
            
              });
            });
          })
        })