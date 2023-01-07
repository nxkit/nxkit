import { Tree } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { getExtensionsFiles } from '../utils/get-extensions-files';

export function update(tree: Tree) {
  const filePathsToUpdate = getExtensionsFiles(tree);
  filePathsToUpdate.forEach((filePath) => {
    const fileEntry = tree.read(filePath);
    const contents = fileEntry.toString();

    // Replace each `@nxkit/style-dictionary` import with `@nxkit/style-dictionary/extensions`
    const newContents = tsquery.replace(
      contents,
      'ImportDeclaration > StringLiteral[value=@nxkit/style-dictionary]',
      () => `'@nxkit/style-dictionary/extensions'`
    );

    // only write the file if something has changed
    if (newContents !== contents) {
      tree.write(filePath, newContents);
    }
  });
}

export default update;
