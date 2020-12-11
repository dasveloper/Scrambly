import { useState } from 'react';
import Head from 'next/head';
import getPixels from 'get-pixels';
import savePixels from 'save-pixels';
import seedrandom from 'seedrandom';
import download from 'downloadjs';
import ReactCompareImage from 'react-compare-image';
import { shuffleImage, unshuffleImage, randomIndexes } from '../lib/shufflers';

export default function Main() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setIsProcessing] = useState(false);

  const [error, setError] = useState(null);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleImageChange = (event) => {
    setError(null);
    const newFile = event?.target?.files?.[0];
    setFile(newFile ? URL.createObjectURL(newFile) : null);
  };
  const handlePasswordChange = (event) => {
    setError(null);
    setPassword(event.target.value);
  };
  const handleScrambleImage = () => {
    setError(null);
    setIsProcessing(true);

    if (!file) {
      setError('Upload the file you want to scramble');
      setIsProcessing(false);

      return;
    }
    if (!password) {
      setError('Enter a password to scramble the image');
      setIsProcessing(false);
      return;
    }
    const rng = seedrandom(password);
    getPixels(file, async (err, pixels) => {
      const imgPixels = pixels;
      if (err) {
        setError(err);
        setIsProcessing(false);
        return;
      }
      const rndIndexes = randomIndexes(rng, imgPixels.data);
      imgPixels.data = shuffleImage(rndIndexes, imgPixels.data);
      const pixelCanvas = await savePixels(imgPixels, 'canvas');
      const pixelDataUrl = pixelCanvas.toDataURL('image/png');
      download(pixelDataUrl, 'image.png', 'image/png');
      setIsProcessing(false);
    });
  };
  const handleUnscrambleImage = () => {
    setError(null);
    setIsProcessing(true);
    if (!file) {
      setError('Upload the file you want to unscramble');
      setIsProcessing(false);
      return;
    }
    if (!password) {
      setError('Enter a password to unscramble the image');
      setIsProcessing(false);
      return;
    }
    const rng = seedrandom(password);
    getPixels(file, async (err, pixels) => {
      const imgPixels = pixels;
      if (err) {
        setError(err);
        setIsProcessing(false);
        return;
      }
      const rndIndexes = randomIndexes(rng, imgPixels.data);
      imgPixels.data = unshuffleImage(rndIndexes, imgPixels.data);
      const pixelCanvas = await savePixels(imgPixels, 'canvas');
      const pixelDataUrl = pixelCanvas.toDataURL('image/png');
      download(pixelDataUrl, 'image.png', 'image/png');
      setIsProcessing(false);
    });
  };
  return (
    <div>
      <main className="min-h-screen bg-white">
        <div className="relative bg-gray-50 py-20 px-6 overflow-hidden">
          <img alt="Scrambly logo" className="mx-auto w-10 rounded-lg my-2" src="/logo.png" />
          <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full" aria-hidden="true">
            <div className="relative h-full max-w-7xl mx-auto">
              <svg className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2" width="404" height="784" fill="none" viewBox="0 0 404 784">
                <defs>
                  <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" className="text-gray-300" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="404" height="784" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
              </svg>
              <svg className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2" width="404" height="784" fill="none" viewBox="0 0 404 784">
                <defs>
                  <pattern id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" className="text-gray-300" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="404" height="784" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
              </svg>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6  text-center">
            <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-5xl">
              <span className="inline-block text-green-600">Hide your images</span>
              {' '}
              <span className="inline-block text-gray-400">in plain sight</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-lg md:max-w-3xl">
              Scrambly shuffles every pixel in your image so that it is unrecognizable and unrecoverable without your private password. Allowing you to save and share your photos privately.
            </p>
          </div>
          <div className="max-w-6xl mx-auto rounded-lg overflow-hidden mt-10">
            <ReactCompareImage leftImage="/example.png" rightImage="/example-scrambled.png" />
          </div>

        </div>
        <div className="relative py-10 px-6 max-w-3xl mx-auto">
          {processing && (
          <div className="bg-white opacity-70 absolute w-full h-full inset-0 flex justify-center items-center z-40">
            <p className="text-2xl text-gray-800">Processing Image...</p>
          </div>
          )}
          <span className="block text-sm font-medium text-gray-700">Choose file to scramble or unscramble</span>
          <label htmlFor="file-upload" className="mt-1 flex flex-col items-center px-6 py-8 hover:bg-gray-50 border-2 border-gray-300 border-dashed rounded-md">
            {file && <img alt="Upload preview" src={file} />}
            {!file && (
            <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            )}
            <div className="mt-4 flex text-sm text-gray-600">
              <span>Click here to upload a file</span>

              <input onChange={handleImageChange} id="file-upload" name="file-upload" type="file" className="sr-only" />
            </div>
          </label>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Unscramble password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input value={password} onChange={handlePasswordChange} type={showPassword ? 'text' : 'password'} className="border-2 py-3 pl-4 pr-10 block w-full shadow-sm focus:ring-red-500 focus:border-red-500 border-gray-300 rounded-md" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {!showPassword && (
                <button type="button" onClick={toggleShowPassword}>
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                )}
                {showPassword && (
                <button type="button" onClick={toggleShowPassword}>
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 mx-auto sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <button onClick={handleScrambleImage} type="button" href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                Scramble Image
              </button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">

              <button onClick={handleUnscrambleImage} type="button" href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10">
                Unscramble Image
              </button>
            </div>
          </div>
          {error && (
          <div className="mt-6">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-sm text-red-700">
                    <p>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

        </div>
        <div className="py-10 px-6 max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Scrambling an image
          </h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="text-lg leading-6 font-medium text-gray-900">
                1. Upload the image you want to scramble
              </dt>
              <dd className="ml-4 mt-2 text-base text-gray-500">
                Choose the image that you want to scramble. Most image types are accepted.
              </dd>
            </div>
            <div>
              <dt className="text-lg leading-6 font-medium text-gray-900">
                2. Choose an unscramble password
              </dt>
              <dd className="ml-4 mt-2 text-base text-gray-500">
                This is the password that you will need to use to restore your image to it&apos;s normal state.
              </dd>
            </div>
            <div>
              <dt className="text-lg leading-6 font-medium text-gray-900">
                3. Click &#39;Scramble Image&#39;
              </dt>
              <dd className="ml-4 mt-2 text-base text-gray-500">
                When you click &#39;Scramble Image&#39; your image will be securely scrambled and downloaded automatically.
              </dd>
            </div>
          </dl>
        </div>
        <div className="py-10 px-6 max-w-3xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Unscrambling an image
          </h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="text-lg leading-6 font-medium text-gray-900">
                1. Upload the image you want to unscramble
              </dt>
              <dd className="ml-4 mt-2 text-base text-gray-500">
                Choose the scrambled image that you want to unscramble.
              </dd>
            </div>
            <div>
              <dt className="text-lg leading-6 font-medium text-gray-900">
                2. Enter your unscramble password
              </dt>
              <dd className="ml-4 mt-2 text-base text-gray-500">
                Enter the password that was used to scramble your image. If your password is incorrect it will not work.
              </dd>
            </div>
            <div>
              <dt className="text-lg leading-6 font-medium text-gray-900">
                3. Click &#39;Unscramble Image&#39;
              </dt>
              <dd className="ml-4 mt-2 text-base text-gray-500">
                When you click &#39;Unscramble Image&#39; your image will be securely unscrambled and downloaded automatically.
              </dd>
            </div>
          </dl>
        </div>
        <div className="bg-gray-100">
          <div className="py-10 px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Frequently asked questions
            </h2>
            <div className="mt-12">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    How does it work?
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    When you scramble an image with Scrambly your image is disected pixel by pixel and shuffled in a randomized but predictable way, allowing you to reverse the process but preventing people without your password from unscrambling your image.
                  </dd>
                </div>

                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Is it really private?
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    As with everything in security, if someone has access to your image and are sufficiently determined, they theoretically could reveal your image eventually. However, Scrambly&apos;s algorithm should realistically prevent anyone from viewing your image without your password.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    How do I know you&apos;re not secretly looking at my pictures?
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Privacy is an important with Scrambly. To ensure your privacy your images never leave your browser, meaning it never hits our servers and is not visible to us at any point. As an added layer of transparency, all of Scrambly&apos;s code is open source
                    {' '}
                    <a href="https://github.com/dasveloper/Scrambly" target="_blank" rel="noreferrer noopener" className="text-green-600 hover:text-green-700">here</a>
                    .
                  </dd>
                </div>

              </dl>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="https://github.com/dasveloper/Scrambly" target="_blank" rel="noreferrer noopener" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2020 Scrambly, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
