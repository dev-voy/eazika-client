interface CreateShopPayload {
  shopName: string;
  shopCategory: string;

  shopImages: string[];
  fssaiNumber: string;
  gstNumber?: string;
  documents: {
    aadharImage: string;
    electricityBillImage: string;
    businessCertificateImage: string;
    panImage: string;
  };
}

export { CreateShopPayload };
