import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop(`${mockPath}/plopfile.js`);
const multipleAdds = plop.getGenerator('multiple-adds');

test.before(() => {
	return multipleAdds.runActions({name: 'John Doe'});
});

test('Check that all files have been created', t => {
	const expectedFiles = [
		'john-doe/add.txt',
		'john-doe/another-add.txt',
		'john-doe/nested-folder/a-nested-add.txt',
		'john-doe/nested-folder/another-nested-add.txt'
	];
	expectedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.true(fs.existsSync(filePath), `Can't resolve ${filePath}`);
	});
});

test('Test the content of the rendered file add.txt', t => {
	const filePath = path.resolve(testSrcPath, 'john-doe/add.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('name: John Doe'));
});

test('Test the content of the rendered file in nested folder', t => {
	const filePath = path.resolve(testSrcPath, 'john-doe/nested-folder/a-nested-add.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('constant name: JOHN_DOE'));
});
