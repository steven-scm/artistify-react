import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// custom tools
import CustomInputFile from "./../icon/IconAvatarAdmin";
import APIHandler from "../../api/APIHandler";


// import LabPreview from "../LabPreview";

// styles
import "./../../styles/form.css";
import "./../../styles/icon-avatar.css";

const FormAlbum = ({ mode = "create", _id }) => {
	const params = useParams();
	const navigate = useNavigate();

	const [{ title, releaseDate, artist, cover, description, label }, setState] =
		useState({
			title: "",
			releaseDate: "",
			artist: "",
			cover: "",
			description: "",
			label: ""
		});

	const [artists, setArtists] = useState([]);

	const [labels, setLabels] = useState([]);



	console.log("THIS is setStage", setState);
	console.log("THIS is userState", useState);

	console.log("THIS is useEffect", useEffect);
	console.log("THIS is useParams", useParams);
	console.log("THIS is useNavigate", useNavigate);

	console.log("THIS is Custom...", CustomInputFile);



	useEffect(() => {
		const initFormData = async () => {
			try {
				const apiRes = await APIHandler.get(`/albums/${_id}`);
				delete apiRes.data._id; // on a pas besoin de l'ID ds le front 
				setState({ ...apiRes.data }); // on pourrait ne pas spread à tester !
			} catch (err) {
				console.log(err);
			}

		}
		if (mode === "edit") initFormData();

	}, [mode, _id]);


	useEffect(async () => {
		try {
			const { data } = await APIHandler.get("/artists");
			setArtists(data.artists);
		} catch (err) {
			console.log(err);
		}
	}, []);

	useEffect(async () => {
		try {
			const { data } = await APIHandler.get("/labels");
			setLabels(data.labels);
		} catch (err) {
			console.log(err);
		}
	}, []);


	const handleChange = (e) => {
		// e.persist(); // je test sans le mettre !
		console.log("THIS is e :", e);
		console.log("THIS is setState() line below :", setState((prevValues) => ({
			...prevValues,
			[e.target.id]: e.target.value

		})));

		setState((prevValues) => ({
			...prevValues,
			[e.target.id]: e.target.value

		}));
	}
	console.log("THIS is handleChange", handleChange);


	const handleSubmit = async (e) => {
		e.preventDefault();

		const fd = new FormData();
		fd.append("title", title);
		fd.append("releaseDate", releaseDate);
		fd.append("artist", artist);
		fd.append("cover", cover);
		fd.append("description", description);
		fd.append("label", label);

		try {
			if (mode === "create") await APIHandler.post("/albums", fd);
			else await APIHandler.patch(`/albums/${params.id}`, fd);

			navigate("/admin/albums");
		} catch (apiErr) {
			console.log(apiErr);
		}
	}

	const handleCover = (file) => {
		const reader = new FileReader();
		reader.onload = () => {
			// when the fileReader ends reading image  ...
			const base64String = reader.result;
			setState((preValues) => ({
				// add the actual file to the state + the tmp logo as a preview before upload
				...preValues,
				cover: file,
				coverTmp: base64String,
			}));

		}
		reader.readAsDataURL(file); // read the file from the local disk
	}



	return (
		// <>
		// 	<h1 className="title diy">D.I.Y (FormAlbum)</h1>
		// 	<p>Code a form to Create/Update albums.</p>
		// 	<LabPreview name="albumForm" isSmall />
		// </>

		<form className="form" onSubmit={handleSubmit} onChange={handleChange}>
			<label className="label" htmlFor="title">
				title
			</label>
			<input className="input" id="title" type="text" defaultValue={title} />

			<label htmlFor="artist">
				artist
			</label>
			<select name="artist" id="artist" defaultValue={artist} >
				{/* <option value="Rock">Rock</option>
					<option value="Pop">Pop</option>
					<option value="Folk">Folk</option>
					<option value="RnB">RnB</option> */}

				{artists.map((artist) => (
					<option value={artist._id} key={artist._id}>{artist.name}</option>
				))}

			</select>





			{/* <label htmlFor="artist">
				artist
			</label>
			<input className="input" type="text" id="artist" defaultValue={artist} /> */}
			<label className="label" htmlFor="label">
				label
			</label>
			<select name="label" id="label" defaultValue={label} >
				{/* <option value="Rock">Rock</option>
					<option value="Pop">Pop</option>
					<option value="Folk">Folk</option>
					<option value="RnB">RnB</option> */}

				{labels.map((label) => (
					<option value={label._id} key={label._id}>{label.name}</option>
				))}

			</select>
			{/* 
			<label className="label" htmlFor="label">
				label
			</label>
			<input className="input" id="label" type="text" defaultValue={label} /> */}
			<label className="label" htmlFor="releaseDate">
				release date
			</label>
			<input className="input" id="releaseDate" type="date" defaultValue={releaseDate} />

			<label className="label" htmlFor="cover">cover</label>
			<CustomInputFile
				avatar={cover}
				clbk={(e) => handleCover(e.target.files[0])}
			/>
			<label className="label" htmlFor="description">
				description
			</label>
			{/* <textarea type="text" className="input" id="description" name="description" defaultValue={description} >
					test description
				</textarea> */}
			<textarea id="description" defaultValue={description} />

			<button className="btn">ok</button>




		</form>
	);
};

export default FormAlbum;
