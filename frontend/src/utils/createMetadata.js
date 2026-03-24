export function createMetadata(name, brand, serial, description, imageURI) {
  return {
    name,
    brand,
    serial,
    description,
    image: imageURI
  }
}