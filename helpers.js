class Dtsh {

  //clear the console screen
  clear() {
    return process.stdout.write('\x1B[2J\x1B[0f');
  };
  
  //turns a single field into an array (used for lists of servername and channel names mostly)
  createArrayFromCollection(collection, field) {
    let ar = []

    collection.map((item) => {
      ar.push(item[field]);
    });
    return ar;
  };


}

export default Dtsh;
