import { Tree } from '@nrwl/devkit';

export function updateGitIgnore(tree: Tree) {
  if (!tree.exists('.gitignore')) {
    return;
  }

  const gitIgnoreContent = tree.read('.gitignore', 'utf-8').trimEnd();

  if (!gitIgnoreContent?.includes(`# Playwright`)) {
    const textToAdd = `

# Playwright
**/test-results/
**/playwright-report/
**/playwright/.cache/
`;
    tree.write('.gitignore', gitIgnoreContent + textToAdd);
  }
}
