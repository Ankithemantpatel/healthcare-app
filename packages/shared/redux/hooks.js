const { useDispatch, useSelector } = require("react-redux");

const useAppDispatch = () => useDispatch();
const useAppSelector = useSelector;

module.exports = {
  useAppDispatch,
  useAppSelector,
};