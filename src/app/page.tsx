"use client";
"use client";
import { useState, ChangeEvent } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

export default function Home() {
  const [title, setTitle] = useState<string>("");
  const [finalText, setFinalText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [newImageName, setNewImageName] = useState<string>("");

  const handleSelectedImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setNewImageName(file.name);
    }
  };

  const generateReport = () => {
    if (!selectedImage) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ 
              alignment: "center",
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 60,
                }),
              ],
            }),
            new Paragraph({ 
              alignment: "center",
              children: [
                new TextRun({
                  text: "",
                  break: 6,
                }),
              ],
            }),
            new Paragraph({
              alignment: "center",
              children: [
                new ImageRun({
                  data: selectedImage,
                  transformation: {
                    width: 450,
                    height: 400,
                  },
                  altText: {
                    title: newImageName,
                    description: newImageName,
                    name: newImageName,
                  },
                }),
                new TextRun({
                  text: `CAPTION: ${newImageName}`,
                  break: 2,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  break: 3,
                  text: finalText,
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "report.docx");
    });
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md p-4'>
        <h2 className='text-2xl font-semibold mb-2'>Report Generator</h2>

        <label htmlFor='title' className='block text-gray-700 font-bold mb-2'>
          Título do relatório
        </label>
        <input
          type='text'
          id='title'
          name='title'
          placeholder='Escreva o título do relatório'
          className='w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-4 mb-4 focus:outline-none focus:bg-white focus:border-gray-500 text-black'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor='image' className='block text-gray-700 font-bold mb-2'>
          Adiconar imagem
        </label>
        <input
          type='file'
          id='image'
          name='image'
          accept='image/*'
          className='w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-4 mb-4 focus:outline-none focus:bg-white focus:border-gray-500 text-black'
          onChange={handleSelectedImage}
        />

        {selectedImage && (
          <div className='mb-4'>
            <label
              htmlFor='newImageName'
              className='block text-gray-700 font-bold mb-2'
            >
              Novo nome do arquivo de imagem
            </label>
            <input
              type='text'
              id='newImageName'
              name='newImageName'
              className='w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:bg-white focus:border-gray-500 text-black'
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
            />
          </div>
        )}

        <label
          htmlFor='final-text'
          className='block text-gray-700 font-bold mb-2'
        >
          Texto final
        </label>
        <textarea
          id='final-text'
          name='final-text'
          rows={4}
          className='w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-4 mb-4 focus:outline-none focus:bg-white focus:border-gray-500 text-black'
          placeholder='Adione o texto final do relatório'
          value={finalText}
          onChange={(e) => setFinalText(e.target.value)}
        ></textarea>

        <button
          onClick={generateReport}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Gerar Relatório
        </button>
      </div>
    </div>
  );
}
