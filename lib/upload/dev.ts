import 'zui-dev';
import {Upload} from './src/main';

onPageLoad(() => {
    const uploadElm1 = document.querySelector('#example1') as HTMLElement | null;
    if (!uploadElm1) {
        return;
    }
    new Upload(uploadElm1, {
        name: 'upload1',
        deleteBtn: true,
        renameBtn: true,
    });

    const uploadElm2 = document.querySelector('#example2') as HTMLElement | null;
    if (!uploadElm2) {
        return;
    }
    const file1 = new File(['file1'], 'file1.txt', {
        type: 'text/plain',
    });
    const file2 = new File(['file2'], 'file2.txt', {
        type: 'text/plain',
    });
    new Upload(uploadElm2, {
        name: 'upload2',
        multiple: true,
        deleteBtn: true,
        renameBtn: true,
        defaultFileList: [file1, file2],
        limitSize: '50MB',
    });
});
