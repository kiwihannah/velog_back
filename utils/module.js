module.exports = {
  ControllerAsyncWrapper: asyncFn => {
    return (async (req, res, next) => {
      try {
        return await asyncFn(req, res, next);
      } catch(error) {
        console.error('Error from ControllerAsyncWrapper : ', error);
        return res.status(500).json({ msg: error.message });
      };
    });
  },

  ModelAsyncWrapper: asyncFn => {
    return (async (req, res, next) => {
      try {
        return await asyncFn(req, res, next);
      } catch(error) {
        throw new Error(error);
        // return error;
        // return res.status(500).json({ msg: "Model error" });
      };
    });
  },
};

// return error를 하면 ControllerAsyncWrapper에서 error catch를 못 함.
// return ststus(500).json({ msg: "Model error" })을 하면 
// return status(500).json({ msg: "Controller error" }); 이걸로 바뀜