const userService = require('./userService');
const userRepository = require('../repositories/userRepository')

jest.mock('../repositories/userRepository.js');

describe('UserService - createNewUser',  () => {

    it('Harus berhasil membuat user baru jika nama ada ', async () => {

        const mockName = 'Hanif';

        const mockResponse = {id: 1 , name: mockName};
        userRepository.create.mockResolvedValue(mockResponse);

        const user = await userService.createNewUser(mockName);

        expect(user).toBe(mockResponse);

        expect(userRepository.create).toHaveBeenCalledWith(mockName);
    });

    it('Harus melempar error (throw error) jika nama tidak ada (null)', async () => {
        await expect(userService.createNewUser(null)).rejects.toThrow('Name is Required');
    });

    it('Harus melempar error (throw error) jika nama kosong (undefined) ', async () => {
        await expect(userService.createNewUser(undefined)).rejects.toThrow('Name is Required');
    });

});