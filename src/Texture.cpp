#include"Texture.h"

Texture::Texture(const char* imagePath, GLenum texType, GLuint slot, GLenum pixelType)
{
	// Assigns the type of the texture ot the texture object
	type = texType;
	unit = slot;

	// Stores the width, height, and the number of color channels of the image
	int widthImg, heightImg, numColCh;
	// Flips the image so it appears right side up
	stbi_set_flip_vertically_on_load(true);
	// Reads the image from a file and stores it in bytes
	unsigned char* bytes = stbi_load(imagePath, &widthImg, &heightImg, &numColCh, 0);
	// Generates an OpenGL texture object
	glGenTextures(1, &ID);
	// Assigns the texture to a Texture Unit
	glActiveTexture(GL_TEXTURE0 + slot);
	unit = slot;
	glBindTexture(texType, ID);
	// Assigns the texture to a Texture Unit
	//
	glBindTexture(texType, ID);
	glTexParameteri(texType, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(texType, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(texType, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(texType, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	// Configures the type of algorithm that is used to make the image smaller or bigger
	glTexParameteri(texType, GL_TEXTURE_MIN_FILTER, GL_NEAREST_MIPMAP_LINEAR);
	glTexParameteri(texType, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

	// Assigns the image to the OpenGL Texture object
	if (bytes) {
		GLenum format;
    if (numColCh == 4)
        format = GL_RGBA;
    else if (numColCh == 3)
        format = GL_RGB;
    else if (numColCh == 1)
        format = GL_RED;
    else
        format = GL_RGB;
		glTexImage2D(texType, 0, GL_RGBA, widthImg, heightImg, 0, format, pixelType, bytes);
		// Generates MipMaps
		glGenerateMipmap(texType);
	}
	else {
		std::cout << "ERROR";
	}

	stbi_image_free(bytes);

	// glBindTexture(texType, 0);

	glActiveTexture(GL_TEXTURE0);
	
}

void Texture::texUnit(Shader& shader, const char* uniform, GLuint unit)
{   
	GLuint texUni = glGetUniformLocation(shader.ID, uniform);
	// Shader needs to be activated before changing the value of a uniform
	 shader.use();
	// Sets the value of the uniform
	glUniform1i(texUni, unit);
}

void Texture::Bind()
{   
	glActiveTexture(GL_TEXTURE0+unit);
	glBindTexture(type, ID);
	

}

void Texture::Unbind()
{
	glBindTexture(type, 0);
}

void Texture::Delete()
{
	glDeleteTextures(1, &ID);
}