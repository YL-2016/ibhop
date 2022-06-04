// Assets
import image1 from "../PlaceImg/TorontoPublicLibrary.png";
import image2 from "../PlaceImg/AlbionHills.png";
import image3 from "../PlaceImg/AGO.png";

const placese = [
	{
		id: 1,
		title: "Toronto Public Library - City Hall Branch",
		type: "Library",
		address:"Toronto City Hall, 100 Queen St W, Toronto, ON M5H 2N3",
		description:
			"Greate place to study",
		division: "Toronto DT",
        openHour: "9Am to 10pm",
		elevator: true,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [43.65409653807708, -79.38343994315908],
		},
		pic: image1,
	},

	{
		id: 2,
		title: "Art Gallery of Ontario",
		type: "Gallery",
		address:"317 Dundas St W, Toronto, ON M5T 1G4",
		description:
			"Greate place to enjoy arts",
		division: "Toronto DT",
        openHour: "10Am to 10pm",
		elevator: true,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [43.65376590813389, -79.39246932269874],
		},
		pic: image2,
	},

	{
		id: 3,
		title: "Albion Hills Conservation Park",
		type: "Conservation Park",
		address: "16500 Peel Regional Rd 50, Caledon, ON L7E 3E7",
		description:
			"Greate place to enjoy nature",
		division: "Caledon",
        openHour: "10Am to 10pm",
		elevator: false,
		cctv: true,
		parking: true,
		location: {
			type: "Point",
			coordinates: [43.93239007431277, -79.8257797430922],
		},
		pic: image3,
	},
];

export default placese;
