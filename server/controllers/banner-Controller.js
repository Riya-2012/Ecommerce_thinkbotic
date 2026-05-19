const Banner = require("../models/banner-model");

// ADD BANNER

exports.addBanner =
async (req, res) => {

  try {

    const {

      type,
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      priceText,

    } = req.body;

    const banner =
      new Banner({

        type,
        title,
        subtitle,
        description,
        buttonText,
        buttonLink,
        priceText,

        img:
          req.file.filename,

      });

    await banner.save();

    res.status(201).json({

      success: true,
      message:
        "Banner added successfully",

      data: banner,

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message:
        error.message,

    });
  }
};

// GET ALL

exports.getBanners =
async (req, res) => {

  try {

    const banners =
      await Banner.find({
        isActive: true
      });

    res.json({

      success: true,
      data: banners,

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message:
        error.message,

    });
  }
};

// DELETE

exports.deleteBanner =
async (req, res) => {

  try {

    await Banner.findByIdAndDelete(
      req.params.id
    );

    res.json({

      success: true,
      message:
        "Banner deleted",

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message:
        error.message,

    });
  }
};

exports.updateBanner =
async (req, res) => {

  try {

    const banner =
      await Banner.findById(
        req.params.id
      );

    if (!banner) {

      return res.status(404).json({

        success: false,
        message:
          "Banner not found",

      });
    }

    banner.type =
      req.body.type;

    banner.title =
      req.body.title;

    banner.subtitle =
      req.body.subtitle;

    banner.description =
      req.body.description;

    banner.buttonText =
      req.body.buttonText;

    banner.buttonLink =
      req.body.buttonLink;

    banner.priceText =
      req.body.priceText;

    if (req.file) {

      banner.img =
        req.file.filename;
    }

    await banner.save();

    res.json({

      success: true,
      message:
        "Banner updated",

      data: banner,

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message:
        error.message,

    });
  }
};
