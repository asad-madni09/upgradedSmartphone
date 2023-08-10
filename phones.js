const { query } = require("express");
const { on } = require("nodemon");

module.exports = {
  addSmartPhone,
  searchingPhone,
  getBrands,
  getModels,
  getPhonesByPrice,
};
var ObjectId = require("mongodb").ObjectId;

async function addSmartPhone(db, data) {
  let add = await db.collection("phones");
  add.insertMany(data);
}
//Put form control of bootstrap n top of phone table having Brand, model test box

async function searchingPhone(db, brandId, model, from, to, storage) {
  let query = [];
  if (brandId) {
    query.push({
      $match: {
        brandId: new ObjectId(brandId),
      },
    });
  }
  query.push({
    $lookup: {
      from: "brands", // databse name (not local)
      localField: "brandId", // usi database me kaunse field ko select krna hai
      foreignField: "_id", // dusre databse ka field
      as: "brand", // sare data ko kisme rkhna hai wo naam batao
    },
  });

  if (from || to) {
    query.price = {};
  }

  if (model) {
    query.push({
      $match: {
        model: model,
      },
    });
  }
  if (from && to) {
    query.push({
      $match: {
        price: { $gte: from, $lte: to },
      },
    });
  } else if (from) {
    query.push({
      $match: { price: { $gte: from } },
    });
  } else if (to) {
    query.push({
      $match: { price: { $lte: to } },
    });
  }
  if (storage) {
    query.push({
      $match: {
        storage: { $eq: storage },
      },
    });
  }
  //   console.log(query);
  const result = await db.collection("phones").aggregate(query).toArray();

  return result;
}

// function to get all brands
async function getBrands(db) {
  let save = [];
  let gettingBrand = await db.collection("brands").find();

  const phoneBrand = await gettingBrand.toArray();
  //   for (i = 0; i < phoneBrand.length; i++) {
  //     let onlyBrand = phoneBrand[i].name;
  //     save.push(onlyBrand);
  //   }

  return phoneBrand;
}

// function to give brand and it shows models as output
async function getModels(db, brand) {
  let models = [];
  let query = {};
  if (brand) {
    query.brandId = new ObjectId(brand);
  }
  let phoneResult = await db.collection("phones").find(query);
  const phones = await phoneResult.toArray();
  for (i = 0; i < phones.length; i++) {
    let onlyModel = phones[i].model;
    if (!models.includes(onlyModel)) models.push(onlyModel);
  }
  return models;
}
/// function for price range
async function getPhonesByPrice(db, from, to) {
  let query = {};
  query.price = {};
  if (from && to) {
    query.price = { $gte: from, $lte: to };
  } else if (from) {
    query.price = { $gte: from };
  } else if (to) {
    query.price = { $lte: to };
  }
  // console.log(JSON.stringify(query));
  let phoneResult = await db.collection("phones").find(query);
  let result = await phoneResult.toArray();
  return result;
}
