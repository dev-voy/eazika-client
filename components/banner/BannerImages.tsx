import Image from "next/image";

export default function BannerImages() {
  // const banners = api call to fetch banner images, for now we will hardcode it
  const banners = [
    {
      id: 1,
      src: "/banners/banner_01.png",
      alt: "Banner 1",
    },
    {
      id: 2,
      src: "/banners/banner_02.png",
      alt: "Banner 2",
    },
    {
      id: 3,
      src: "/banners/banner_03.png",
      alt: "Banner 3",
    },
  ];

  return (
    <div className="flex">
      {banners.map((b) => (
        <Image
          key={b.id}
          src={b.src}
          alt={b.alt}
          width={1200}
          height={400}
          className="w-full h-auto object-cover"
        />
      ))}
    </div>
  );
}
