// Set the i-th bit to 1
function set(vec, i) {
    var bigIndex = Math.floor(i / 32);
    var smallIndex = i % 32;
    vec[bigIndex] = vec[bigIndex] | (1 << smallIndex);
}
// Clear the i-th bit
function clear(vec, i) {
    var bigIndex = Math.floor(i / 32);
    var smallIndex = i % 32;
    vec[bigIndex] = vec[bigIndex] & ~(1 << smallIndex);
}
// Return the value of the i-th bit
function get(vec, i) {
    var bigIndex = Math.floor(i / 32);
    var smallIndex = i % 32;
    var value = vec[bigIndex] & (1 << smallIndex);
    // we convert to boolean to make sure the result is always 0 or 1,
    // instead of what is returned by the mask
    return value != 0;
}
function buildVector(bitCount) {
    // The constructor accepts a number of 32-bit integers in the array,
    // which is simply the number of bits in our bit vector divided by 32.
    // We also keep the `Math.ceil` just to make the API more robust.
    return new Uint32Array(Math.ceil(bitCount / 32));
}
const BitVector = {
    buildVector,
    get,
    set,
    clear,
};
export default BitVector;
