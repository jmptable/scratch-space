//////////////////////////////////////////////////////////////////////////////////
//    Init
//////////////////////////////////////////////////////////////////////////////////

// init renderer
var renderer  = new THREE.WebGLRenderer({
  // antialias  : true,
  alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
// renderer.setPixelRatio( 1/2 );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild( renderer.domElement );

// array of functions for the rendering loop
var onRenderFcts= [];

// init scene and camera
var scene = new THREE.Scene();

var ambient = new THREE.AmbientLight( 0x666666 );
scene.add( ambient );

var directionalLight = new THREE.DirectionalLight( 0x887766 );
directionalLight.position.set( -1, 1, 1 ).normalize();
scene.add( directionalLight );

//////////////////////////////////////////////////////////////////////////////////
//    Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////

// Create a camera
var camera = new THREE.Camera();
scene.add(camera);

////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////

var arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam 
  sourceType : 'webcam',
  
  // to read from an image
  // sourceType : 'image',
  // sourceUrl : '../../data/images/img.jpg',   

  // to read from a video
  // sourceType : 'video',
  // sourceUrl : '../../data/videos/headtracking.mp4',    
})

arToolkitSource.init(function onReady(){
  // handle resize of renderer
  arToolkitSource.onResize(renderer.domElement)   
})

// handle resize
window.addEventListener('resize', function(){
  // handle arToolkitSource resize
  arToolkitSource.onResize(renderer.domElement)   
})  
////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////


// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: '/data/camera_para.dat',
  detectionMode: 'mono',
  maxDetectionRate: 30,
  canvasWidth: 80*3,
  canvasHeight: 60*3,
})
// initialize it
arToolkitContext.init(function onCompleted(){
  // copy projection matrix to camera
  camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
})

// update artoolkit on every frame
onRenderFcts.push(function(){
  if( arToolkitSource.ready === false ) return

  arToolkitContext.update( arToolkitSource.domElement )
})


////////////////////////////////////////////////////////////////////////////////
//          Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////

var markerRoot = new THREE.Group
scene.add(markerRoot)
var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
  type : 'pattern',
  patternUrl : '/data/patt.hiro'
  // patternUrl : '../../data/data/patt.kanji'
})

//////////////////////////////////////////////////////////////////////////////////
//    add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

// add a torus knot 
var geometry  = new THREE.CubeGeometry(1,1,1);
var material  = new THREE.MeshNormalMaterial({
  transparent : true,
  opacity: 0.5,
  side: THREE.DoubleSide
}); 
var mesh  = new THREE.Mesh( geometry, material );
mesh.position.y = geometry.parameters.height/2
markerRoot.add( mesh );

var geometry  = new THREE.TorusKnotGeometry(0.3,0.1,32,32);
var material  = new THREE.MeshNormalMaterial(); 
var mesh  = new THREE.Mesh( geometry, material );
mesh.position.y = 0.5
markerRoot.add( mesh );

onRenderFcts.push(function(){
  mesh.rotation.x += 0.1
})

//////////////////////////////////////////////////////////////////////////////////
//    render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
// render the scene
onRenderFcts.push(function(){
  renderer.render( scene, camera );
})

// run the rendering loop
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec  = nowMsec
  // call each update function
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })
})