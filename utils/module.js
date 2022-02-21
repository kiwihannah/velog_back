module.exports = {
  ControllerAsyncWrapper: asyncFn => {
    return (async (req, res, next) => {
      try {
        return await asyncFn(req, res, next);
      } catch(error) {
        console.error('Error from ControllerAsyncWrapper : ', error);

        if(error.msg) {
          return res.status(400).json(error);
        }
        return res.status(500).json({ msg: error.message });
      };
    });
  },

  ModelAsyncWrapper: asyncFn => {
    return (async (req, res, next) => {
      try {
        return await asyncFn(req, res, next);
      } catch(error) {
        throw (error);
      };
    });
  },
};

// return error를 하면 ControllerAsyncWrapper에서 error catch를 못 함.
// return ststus(500).json({ msg: "Model error" })을 하면 
// return status(500).json({ msg: "Controller error" }); 이걸로 바뀜