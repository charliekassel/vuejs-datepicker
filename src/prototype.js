Date.prototype.normalise = function() {
  let year = this.getFullYear();
  let month = addZeroIfNeed(this.getMonth() + 1);
  let day = addZeroIfNeed(this.getDate());
  return `${year}-${month}-${day}`;
};

Date.prototype.normaliseDot = function() {
  let year = this.getFullYear();
  let month = addZeroIfNeed(this.getMonth() + 1);
  let day = addZeroIfNeed(this.getDate());
  return `${day}.${month}.${year}`;
};

Date.prototype.same = function(date) {
  return this.normalise() === date.normalise()
};

function addZeroIfNeed(value) {
  if (value.toString().length === 1) {
    return "0" + value;
  } else return value;
}