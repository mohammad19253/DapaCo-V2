//LeafetJs Map 

var map = L.map('map').setView([32,55],5)
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=TGy6TVCytBUk4DkgdhXn',{
    attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map)





// customiseRouting //  

    //states :
    var markers=[]
    var latlng=[]
    var Speed=1000000
    //customeformHandle : add Marker by form
    $( "#customiseForm" ).on( "submit", function(e) {
        
        e.preventDefault();
        Speed=$('#customeSpeed').val()

        lat=$('#lat').val()
        lng=$('#lng').val()
        bindPopup=$('#bindPopup').val()
        
        if(lat !='' && lng!='' && bindPopup!=''){
            var marker=L.marker([lat,lng]).bindPopup(`<p>${bindPopup}</p>`).addTo(map)      
            latlng.push(  [marker._latlng.lat , marker._latlng.lng ] )
            markers.push(marker)
            map.fitBounds( L.latLngBounds( [ marker.getLatLng()]))    //zoom on marker
        }
       
        $("#customiseForm").trigger("reset");

    }); 

    // customeformHandle : add Marker by click
  

    map.on('click',addMarker)   
    function addMarker(e){   
        var marker =L.marker(e.latlng).bindPopup(`<p>marker placed</p>`).addTo(map)
        markers.push(marker)
        latlng.push(  [e.latlng.lat , e.latlng.lng ])
    
    }

    function customise_btn(){

         // btn style change onclick
    
        $('#custombtn').addClass('btn-dark')
        $('#custombtn').removeClass('btn-light')
        $('#customiseForm').fadeIn()

    }


    
    //define polyline 
    var line=L.polyline(latlng)

    function startDrawLine(){
      
   

        if(latlng.length<=1){
            swal({
                text: "حداقل دو نقطه در نقشه انتخاب کنید",
                icon: "error",

              });
        }

        else{

            map.off('click',addMarker)   
            $('#map').css('cursor','default')

            line=L.motion.polyline( latlng , {
            color: "red"
            }, {
                auto: true,
          
                speed: Speed
            
            }).addTo(map).bindPopup('move Marker');

          
            
            $('.startDrawLine').hide()
            $('.stopDrawLine').show()
        }
        
        line.on('motion-ended', () => {
            $('.stopDrawLine').hide()
            $('.resumeDrawLine').hide()
        
        })
        

    }

    
    function stopDrawLine(){
        $('.stopDrawLine').hide()
        $('.resumeDrawLine').show()
        line.motionPause()

    }

    function resumeDrawLine(){
        $('.resumeDrawLine').hide()
        $('.stopDrawLine').show()
       line.motionResume()
    }

    function restartDrawLine(){
        swal({
            icon: "success",
            text: "با موفقیت انجام شد",
          });
        map.on('click',addMarker)   
        $('.startDrawLine').show()
        latlng=[]
       for ( i in markers)  map.removeLayer(markers[i])
        map.removeLayer(line)

    }