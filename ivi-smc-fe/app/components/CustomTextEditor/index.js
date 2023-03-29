import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
// import { buildUrlWithToken } from 'utils/utils';
import { makeStyles } from '@material-ui/core';
import { API_ROUTE } from 'containers/apiUrl';

const useStyles = makeStyles({
  root: {
    '& .tox': {
      borderColor: error => {
        if (error) return 'red';
        return '';
      },
    },
  },
});

function CustomEditor({
  // sizeLimit = 1000,
  error = false,
  onChangeValue,
  value,
  ...otherProps
}) {
  const classes = useStyles(error);
  const [tinyEditor, setTinyEditor] = useState(null);

  // useEffect(() => {
  //   // adjust popup position onscroll
  //   const handleScroll = e => {
  //     const { scrollTop } = e.target;
  //     document.querySelector('.tox-tinymce-aux').style.top = `${-scrollTop}px`;
  //   };
  //   document
  //     .querySelector('#appContentContainer')
  //     .addEventListener('scroll', handleScroll);
  //   return () => {
  //     document
  //       .querySelector('#appContentContainer')
  //       .removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  const handleUpdate = (value, editor) => {
    const { length } = editor.getContent({ format: 'text' });
    if (length <= 0 && value.length) {
      onChangeValue({ value, length: 1 });
    } else onChangeValue({ value, length });
    // if (length <= sizeLimit) {
    //   onChangeValue({ value, length });
    // }
  };

  const upLoaderHandler = (blobInfo, success, failure) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob());
    formData.append('isPublic', true);
    axios
      .post(`${API_ROUTE.UPLOAD_API}`, formData)
      .then(res => {
        const url = `${API_ROUTE.DOWNLOAD_PUBLIC_API}/${res.data.id}`;
        success(url);
      })
      .catch(err => {
        failure(err.message, { remove: true });
      });
  };

  // const handleBeforeAddUndo = (evt, editor) => {
  //   const { length } = editor.getContent({ format: 'text' });
  //   if (length > sizeLimit) {
  //     evt.preventDefault();
  //   }
  // };

  // onInitEditor and useEffect -> avoid case first load does not update lenght of text
  // wait ultil editor load success to set value

  const onInitEditor = (e, editor) => {
    setTinyEditor(editor);
  };

  useEffect(() => {
    if (value && tinyEditor) {
      handleUpdate(value, tinyEditor);
    }
  }, [value, tinyEditor]);

  return (
    <div className={classes.root} id="tinymce-container">
      <Editor
        {...otherProps}
        value={value}
        // apiKey="uynciu3vfrlhri2emorotyndkg6kayx5vfpcrs0i6qzs562q"
        init={{
          language: 'vi',
          selector: 'textarea#full-featured-non-premium',
          plugins:
            'print autoresize preview paste importcss searchreplace autolink autosave  save directionality code visualblocks visualchars fullscreen image link codesample table charmap hr pagebreak nonbreaking toc insertdatetime advlist lists textpattern noneditable help charmap emoticons',
          menubar: 'file edit view insert format tools table',
          toolbar:
            'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview  print | insertfile image link codesample | ltr rtl',
          importcss_append: true,
          max_height: 1000,
          statusbar: false,
          image_caption: true,
          quickbars_selection_toolbar:
            'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          toolbar_mode: 'sliding',
          contextmenu: 'link image table',
          images_upload_handler: upLoaderHandler,
          content_style:
            'body { font-family:Helvetica; font-size:14px } p { margin: 0 } img {max-width: 100%}',
          image_dimensions: false,
          relative_urls: false,
          remove_script_host: false,
        }}
        onEditorChange={handleUpdate}
        // onBeforeAddUndo={handleBeforeAddUndo}
        tinymceScriptSrc="/vendor/tinymce/tinymce.min.js"
        onInit={onInitEditor}
      />
    </div>
  );
}
export default React.memo(CustomEditor);
