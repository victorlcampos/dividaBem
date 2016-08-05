export class Utils {
  /**
  * Returns a deep copy of the object
  */
  public static deepCopy(oldObj: any) {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === "object") {
      newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : new Object;
      for (var i in oldObj) {
        newObj[i] = this.deepCopy(oldObj[i]);
      }
    }
    return newObj;
  }
}
