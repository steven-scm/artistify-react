import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// custom tools
import APIHandler from "./../../api/APIHandler";
import CustomInputFile from "./../icon/IconAvatarAdmin";

// import LabPreview from "../LabPreview";

// styles
import "./../../styles/form.css";

const FormArtist = ({ mode = "create", _id }) => {
	// const { id } = useParams();
	const params = useParams();
	const navigate = useNavigate();


	const [{ name, description, style, isBand }, setState] =
		useState({
			name: "",
			description: "",
			style: "",
			isBand: false
		});

	const [styles, setStyles] = useState([]);


	useEffect(() => {
		const initFormData = async () => {
			const apiRes = await APIHandler.get(`/artists/${_id}`);
			delete apiRes.data._id;
			setState({ ...apiRes.data });
		};

		if (mode === "edit") initFormData();
	}, [mode, _id]);



	useEffect(async () => {
		try {
			const { data } = await APIHandler.get("/styles");
			setStyles(data.styles);
		} catch (err) {
			console.log(err);
		}
	}, []);


	const handleSubmit = async (e) => {
		e.preventDefault();

		const artistInfos = {
			name,
			description,
			style,
			isBand
		};

		try {
			if (mode === "create") await APIHandler.post("/artists", artistInfos);
			else await APIHandler.patch(`/artists/${params.id}`, artistInfos);

			navigate("/admin/artists");
		} catch (apiErr) {
			console.error(apiErr);
		}
	};

	const handleChange = (e) => {
		e.persist();
		setState((prevValues) => ({
			...prevValues,
			[e.target.id]: e.target.value,
		}));
	};



	return (
		<>
			{/* <h1 className="title diy">D.I.Y (FormArtist)</h1>
			<p>Code a form to Create/Update artists.</p>
			<LabPreview name="artistForm" isSmall />
			<hr /> */}


			<form className="form" onSubmit={handleSubmit} onChange={handleChange}>
				<label className="label" htmlFor="name">
					name
				</label>
				<input className="input" id="name" type="text" defaultValue={name} />

				<label className="label" htmlFor="description">
					description
				</label>
				{/* <textarea type="text" className="input" id="description" name="description" defaultValue={description} >
					test description
				</textarea> */}
				<textarea defaultValue={description} />

				<label className="label" htmlFor="style">
					style
				</label>

				{/* <select name="style" id="style" className="input select" defaultValue={style}>
					<option value={style}>please select a style</option>
					<option value={style}>JAZZ</option>
					<option value={style}>HIP-HOP</option>
					<option value={style}>ROCK</option>
					{{#each styles}}
        <option value="{{this._id}}">{{this.name}}</option>
        {{/each}}
				</select> */}

				<select name="style" id="style" defaultValue={style} >
					{/* <option value="Rock">Rock</option>
					<option value="Pop">Pop</option>
					<option value="Folk">Folk</option>
					<option value="RnB">RnB</option> */}

					{styles.map((style) => (
						<option value={style._id} key={style._id}>{style.name}</option>
					))}

				</select>

				<label htmlFor="isBand" className="label">is a band ? </label>
				<label htmlFor="isBand" className="label">yes</label>
				<input type="radio" name="isBand" value="yes" />
				<label htmlFor="isBand" className="label">no</label>
				<input type="radio" name="isBand" value="nope" />



				{/* <input type="checkbox" name="isBand" id="isBand" /></label> */}


				<button className="btn">ok</button>
			</form>
		</>




	);
};

export default FormArtist;
