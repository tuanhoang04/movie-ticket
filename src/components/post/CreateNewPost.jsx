import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import { useEffect, useState } from "react";
import { Alert } from "@material-tailwind/react";

function FancyEditor({ handleContentChange }) {
  const [selected, setSelected] = useState("regular");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,

      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    onUpdate: ({ editor }) => {
      const level = editor.getAttributes("heading").level;
      if (editor.isActive("paragraph")) setSelected("regular");
      else if (level === 1) setSelected("h1");
      else if (level === 2) setSelected("h2");

      const text = editor.getText();

      handleContentChange(editor.getHTML());
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    },
  });

  const [wordCount, setWordCount] = useState(0);

  const handleChange = (e) => {
    const value = e.target.value;

    setSelected(value);
    editor.chain().focus();
    switch (value) {
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-white rounded-xl shadow-md p-4 space-y-2 text-xl">
      {/* Tool Bar */}
      <div className="flex items-center gap-10 pb-2 text-black ">
        <div className="flex gap-5 lg:gap-10 justify-between items-center  ">
          <span>{wordCount} words</span>
          <div>
            <select
              name=""
              id=""
              value={selected}
              className="focus:outline-none hover:cursor-pointer w-fit px-3"
              onChange={handleChange}
            >
              <option value="regular">Regular</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-7">
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleBold().run();
            }}
            className={
              editor?.isActive("bold")
                ? "text-blue-500 font-bold w-5 text-2xl"
                : "font-bold w-5 text-2xl"
            }
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor?.isActive("italic")
                ? "text-blue-500 italic w-5 text-2xl"
                : "italic w-5 text-2xl"
            }
          >
            I
          </button>
          {/* Underline button */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor.isActive("underline")
                ? "text-blue-500 underline w-5 text-2xl"
                : "w-5 text-2xl"
            }
          >
            U
          </button>
          {/* Bullet List */}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
            className={
              editor.isActive("bulletList")
                ? "text-blue-500 w-5 text-2xl"
                : " w-5 text-2xl"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-list-ul"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
              />
            </svg>
          </button>

          {/* Ordered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList") ? "text-blue-500 w-5" : "w-5"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-list-ol"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"
              />
              <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z" />
            </svg>
          </button>
          <div className="relative ">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = reader.result;
                  editor.chain().focus().setImage({ src: base64 }).run();
                };
                reader.readAsDataURL(file);
              }}
              className="absolute inset-0 opacity-0 "
            />
            <button
              type="button"
              className="flex items-center gap-2 border-2
            "
            >
              {/* SVG image icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-card-image"
                viewBox="0 0 16 16"
              >
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Editor content area */}
      <div className="relative w-full h-full">
        <EditorContent
          editor={editor}
          className=" w-full h-full  bg-gray-300 p-3 rounded-md text-xl text-black ProseMirror "
        />
      </div>
      <button
        type="submit"
        className="absolute bottom-10 right-10 bg-purple-700 text-white py-1 px-3  hover:bg-purple-800"
      >
        ➤
      </button>
    </div>
  );
}

export default function CreateNewPost() {
  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [disableSearch, setDisableSearch] = useState(false);
  const [movieResults, setMovieResults] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const NoImageText = "No image found";
  const [newImg, setNewImg] = useState(null);

  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    film_name: "",
    new_header: "",
    new_footer: "",
    new_content: "",
  });
  useEffect(() => {
    if (disableSearch) return;

    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);
  const handleMovieSearch = (e) => {
    if (disableSearch) setDisableSearch(false);
    setSearchText(e.target.value);
  };

  const fetchMovieResults = async (movieName) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/film/searchFilm/${movieName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      const currData = await response.json();
      console.log(currData);

      setMovieResults(currData[0]);
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };
  useEffect(() => {
    fetchMovieResults(debouncedSearch);
  }, [debouncedSearch]);

  const handleMovieSelect = (movieName) => {
    setDisableSearch(true);
    setSearchText(movieName);
    setMovieResults([]);
    setFormData({
      ...formData,
      film_name: movieName,
    });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        window.location.reload();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleImageChange = (e) => {
    const image = e.target.files[0];

    if (image) {
      setNewImg(image);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setNewImg(null);
    }
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      new_content: value,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.new_content, "text/html");
    const images = doc.querySelectorAll("img");
    images.forEach((img) => {
      img.style.width = "700px";
    });

    const updatedContent = doc.body.innerHTML;

    const data = new FormData();
    data.append("film_name", formData.film_name);
    data.append("new_header", formData.new_header);
    data.append("new_footer", formData.new_footer);
    data.append("new_content", updatedContent);

    if (newImg) {
      data.append("new_img", newImg);
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/news/create`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: data,
        }
      );
      const result = await response.json();
      if (result.message == "Tạo bản tin thành công") {
        setMessage(`Tạo bản tin thành công`);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="">
      <div className="border-b-2 border-opacity-50 p-5 lg:px-10  text-xl">
        Create Post
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-4 h-fit gap-20 p-5 lg:p-10"
      >
        <div className="col-span-1 flex flex-col gap-5 min-w-72">
          <h1 className="text-xl">Post Header</h1>
          <div className="relative">
            <p className="mb-3">Movie Name</p>
            <input
              name="film_name"
              value={searchText}
              placeholder="Search for a movie"
              onChange={handleMovieSearch}
              className="rounded-md h-10 w-full bg-white bg-opacity-10 p-3 text-white"
              type="text"
            />
            {movieResults
              ? movieResults.length > 0 && (
                  <div className="absolute bg-white w-full max-h-60 overflow-y-auto rounded-md shadow-lg z-10">
                    {movieResults.map((item) => (
                      <div
                        key={item.film_id}
                        className="p-2 hover:bg-gray-200 text-black cursor-pointer"
                        onClick={() => handleMovieSelect(item.film_name)}
                      >
                        {item.film_name}
                      </div>
                    ))}
                  </div>
                )
              : ""}
          </div>
          <div>
            <p className="mb-3">Title</p>
            <input
              name="new_header"
              placeholder="Enter title"
              value={formData.new_header}
              onChange={handleInputChange}
              className="rounded-md h-10 w-full bg-white bg-opacity-10 p-3 text-white"
              type="text"
            />
          </div>
          <div>
            <p className="mb-3">Footer</p>
            <input
              name="new_footer"
              placeholder="Enter footer"
              value={formData.new_footer}
              onChange={handleInputChange}
              className="rounded-md h-10 w-full bg-white bg-opacity-10 p-3 text-white"
              type="text"
            />
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-5">
              <p>Feature Image</p>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer bg-white text-black px-2 py-1 rounded-md hover:bg-gray-400"
                >
                  Upload
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>
            </div>
            <div className="bg-white bg-opacity-25 w-full m-auto relative overflow-hidden  h-44 grid place-content-center rounded-lg">
              {newImg ? (
                <img
                  className="object-contain w-full h-full"
                  src={preview}
                  alt="feature image"
                />
              ) : (
                NoImageText
              )}
            </div>
          </div>
        </div>
        <div className=" lg:col-span-3 w-full flex flex-col min-h-[600px]">
          <div className="flex justify-between mb-5">
            <h1 className="text-xl mb-5">Post Body</h1>
            {message && (
              <Alert className="w-fit" color="yellow">
                {message}
              </Alert>
            )}
          </div>
          <FancyEditor
            handleContentChange={handleContentChange}
            value={formData.new_content}
          />
        </div>
      </form>
    </div>
  );
}
