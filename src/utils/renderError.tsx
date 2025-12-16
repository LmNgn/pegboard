const renderError = (errors: any, feild: string) => {
  return errors[feild] ? (
    <span className="text-red-500">{errors[feild].message}</span>
  ) : null;
};
export default renderError;
